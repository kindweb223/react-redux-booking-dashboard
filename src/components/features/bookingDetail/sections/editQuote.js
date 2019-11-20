import React, { useContext, useEffect, useState } from "react";
import { addDays } from "date-fns/esm";
import axios from 'axios';

import {
  ModalContainer,
  ModalTopSection,
  ModalTitleAndButtons,
  ModalBottomSection
} from "../../../modals/containers";
import Button from "../../../buttons/Button";
import H3 from "../../../typography/H3";
import {
  TableEditableValue,
  TableSectionHeader,
  Table,
  TableValue,
  TableLabel
} from "../../../tables/tables";
import { formatEventDate } from "../../../../utils/dateFormatting";
import { AppReducerContext } from "../../../../contexts/AppReducerContext";
import OutlinedButton from "../../../buttons/OutlinedButton";
import AddGlyph from "../../../../images/Glyphs/AddGlyph";
import colors from "../../../style/colors";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import { updatedDate } from "../../../../utils/dates";
import SvgButton from "../../../buttons/SvgButton";
import RemoveSvg from "../../../../images/ui/remove.svg";
import { formatCurrency } from "../../../../utils/numbers";
import { computeCostItemsSummary } from "../../../../utils/costItemsMath";
import SpinnerContainer from "../../../layout/Spinner";

import {  
  createEmptyQuote,
  createEmptyCostItem,  
} from "../../../../models/bookings";

import { 
  GET_CREATE_BOOKING_QUOTE_SUCCESS, UPDATE_BOOKING_QUOTE_SUCCESS 
} from '../../../../reducers/actionType'

const SvgButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EditQuote = props => {
  const { booking, quoteId, onEndEditing } = props;

  const { state, dispatch } = useContext(AppReducerContext);

  const [selectedQuote, setSelectedQuote] = useState({})
  const [netSubtotal, setNetSubTotal] = useState(0)
  const [taxes, setTaxes] = useState(0)
  const [grandTotal, setGrandTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (quoteId === -1) {
      setSelectedQuote({
        ...createEmptyQuote(booking)
      })
    } else  {
      const selectedOne = state.bookings.quotes.filter(item => item.id === quoteId)
      setSelectedQuote({
        ...selectedOne[0]
      })
    }    
    setLoading(false)    
  }, [])

  useEffect(() => {
    if (selectedQuote.costItems && selectedQuote.discount) {
      let [netSubtotalValue, taxesValue, grandTotalValue] = computeCostItemsSummary(selectedQuote.costItems, selectedQuote.discount)
      setNetSubTotal(netSubtotalValue)
      setTaxes(taxesValue)
      setGrandTotal(grandTotalValue)
    }    
  }, [selectedQuote.costItems, selectedQuote.discount])
  
  const handleChangeQuote = newQuote => {
    if (newQuote.type === 'quote_update_slot') {
      let newOne = { ...selectedQuote }
      newOne.slots[newQuote.index][newQuote.key] = newQuote.value
      setSelectedQuote({ ...newOne })
    } else if (newQuote.type === 'quote_update_multiday_slot_start') {
      setSelectedQuote({
        ...selectedQuote,
        slots: selectedQuote.slots.map((item, nIndex) => {
          if (nIndex === newQuote.index)
            item.dateRange[0] = newQuote.value  
          return item
        })
      })
    } else if (newQuote.type === 'quote_update_multiday_slot_end') {
      setSelectedQuote({
        ...selectedQuote,
        slots: selectedQuote.slots.map((item, nIndex) => {
          if (nIndex === newQuote.index)
            item.dateRange[1] = newQuote.value  
          return item
        })
      })
    } else if (newQuote.type === 'quote_update_slot_start_time') {
      setSelectedQuote({
        ...selectedQuote,
        slots: selectedQuote.slots.map((item, nIndex) => {
          if (nIndex === newQuote.index) {
            item.startHour = newQuote.date.getHours()
            item.startMinute = newQuote.date.getMinutes()
          }
          return item
        })
      })
    } else if (newQuote.type === 'quote_update_slot_end_time') {
      setSelectedQuote({
        ...selectedQuote,
        slots: selectedQuote.slots.map((item, nIndex) => {
          if (nIndex === newQuote.index) {
            item.endHour = newQuote.date.getHours()
            item.endMinute = newQuote.date.getMinutes()
          }
          return item
        })
      })
    } else if (newQuote.type === 'quote_append_slot') {
      setSelectedQuote({
        ...selectedQuote,
        slots: [
          ...selectedQuote.slots,
          {
            kind: "single-day",
            date: newQuote.date || new Date(),
            startHour: (newQuote.startDate && newQuote.startDate.getHours()) || 9,
            startMinute: (newQuote.startDate && newQuote.startDate.getMinutes()) || 0,
            endHour: (newQuote.endDate && newQuote.endDate.getHours()) || 18,
            endMinute: (newQuote.endDate && newQuote.endDate.getMinutes()) || 0
          }
        ]
      })
    } else if (newQuote.type === 'quote_append_slot_multi') {
      setSelectedQuote({
        ...selectedQuote,
        slots: [
          ...selectedQuote.slots,
          {
            kind: "multi-day",
            dateRange: [new Date(), addDays(new Date(), 1)],
            startHour: 9,
            startMinute: 0,
            endHour: 18,
            endMinute: 0
          }
        ]
      })
    } else if (newQuote.type === 'quote_remove_slot') {
      setSelectedQuote({
        ...selectedQuote,
        slots: selectedQuote.slots.filter((item, nIndex) => nIndex !== newQuote.index)
      })
    } else if (newQuote.type === 'update_cost_item') {
      let newCostItems = [ ...selectedQuote.costItems ];
      newCostItems[newQuote.index][newQuote.key] = newQuote.value;
      setSelectedQuote({
        ...selectedQuote,
        costItems: [ ...newCostItems ]
      })
    } else if (newQuote.type === 'remove_cost_item') {
      setSelectedQuote({
        ...selectedQuote,
        costItems: [ ...selectedQuote.costItems.filter((item, nIndex) => nIndex !== newQuote.index)]
      })
    } else if (newQuote.type === 'append_cost_item') {
      setSelectedQuote({
        ...selectedQuote,
        costItems: [
          ...selectedQuote.costItems,
          createEmptyCostItem({ vatRate: newQuote.vatRate })
        ]
      })
    } else if (newQuote.type === 'quote_update_discount') {      
      let discount = 0
      try {
        discount = parseInt(newQuote.value)
      } catch(err) {  
        discount = 0
      }

      setSelectedQuote({
        ...selectedQuote,
        discount: discount,        
        discountText: newQuote.value,
      })
    } else if (newQuote.type === 'set_quote_value') {
      let newSelectedQuote = { ...selectedQuote }
      newSelectedQuote[newQuote.key] = newQuote.value
      setSelectedQuote({
        ...newSelectedQuote
      })
    }
  }

  const handleClickSave = async () => {

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {      
      if (quoteId === -1) {
        const res = await axios.post(
          `/bookings/${booking.id}/quotes`,
          {
            slots: JSON.stringify(selectedQuote.slots),
            costItems: JSON.stringify(selectedQuote.costItems),
            value: selectedQuote.value,
            discount: selectedQuote.discount,        
            note: selectedQuote.note
          },
          config
        )  
        dispatch({
          type: GET_CREATE_BOOKING_QUOTE_SUCCESS,
          payload: res.data.quote,
        })
      } else {
        const res = await axios.put(
          `/bookings/${booking.id}/quotes/${quoteId}`,
          {
            slots: JSON.stringify(selectedQuote.slots),
            costItems: JSON.stringify(selectedQuote.costItems),
            value: selectedQuote.value,
            discount: selectedQuote.discount,        
            note: selectedQuote.note
          },
          config
        ) 
        dispatch({
          type: UPDATE_BOOKING_QUOTE_SUCCESS,
          payload: res.data.quote,
        }) 
      }
      
    } catch (err) {      
    }    
    onEndEditing(false)
  }

  return (
    <ModalContainer>
      <SpinnerContainer loading={loading.toString()} />
      <ModalTopSection>
        <ModalTitleAndButtons>
          <H3 style={{ margin: 0 }}>                                  
            {quoteId === -1 ? "New Quote" : ("Quote " + quoteId)} – {formatEventDate(selectedQuote.createdAt)}
          </H3>
          <div>
            <Button
              style={{ marginRight: 10 }}
              onClick={() => onEndEditing(null)}
            >
              Cancel
            </Button>
            <Button
              primary
              style={{ marginRight: 10 }}
              onClick={() => handleClickSave()}
            >
              Save
            </Button>
          </div>
        </ModalTitleAndButtons>
      </ModalTopSection>

      <ModalBottomSection>
        {/* QUOTE SLOTS */}
        <TableSectionHeader title={"Booking Slots"} />
        {selectedQuote.slots && selectedQuote.slots.length > 0 && (
          <Table
            columns="1fr 1fr 1fr auto"
            columnTitles={["Date", "Start", "End", ""]}
          >
            {selectedQuote.slots
              .map((slot, slotIndex) => {
                switch (slot.kind) {
                  case "multi-day":
                    const startDate = new Date(slot.dateRange[0]);
                    const endDate = new Date(slot.dateRange[slot.dateRange.length - 1]);
                    return (
                      <React.Fragment key={slotIndex}>
                        <div style={{ display: "flex" }}>
                          <DatePicker
                            selected={startDate}
                            startDate={startDate}
                            endDate={endDate}
                            selectsEnd
                            onChange={date =>
                              handleChangeQuote({
                                type: "quote_update_multiday_slot_start",
                                booking: booking.id,
                                index: slotIndex,
                                value: date
                              })
                            }
                            dateFormat="dd/MM/yyyy"
                          />
                          <DatePicker
                            selected={endDate}
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            selectsEnd
                            onChange={date =>
                              handleChangeQuote({
                                type: "quote_update_multiday_slot_end",
                                booking: booking.id,
                                index: slotIndex,
                                value: date
                              })
                            }
                            dateFormat="dd/MM/yyyy"
                          />
                        </div>
                        <DatePicker
                          selected={updatedDate(
                            new Date(),
                            slot.startHour,
                            slot.startMinute
                          )}
                          onChange={date =>
                            handleChangeQuote({
                              type: "quote_update_slot_start_time",
                              booking: booking.id,
                              index: slotIndex,
                              key: "date",
                              date: date
                            })
                          }
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          dateFormat="h:mm aa"
                        />
                        <DatePicker
                          selected={updatedDate(
                            new Date(),
                            slot.endHour,
                            slot.endMinute
                          )}
                          onChange={date =>
                            handleChangeQuote({
                              type: "quote_update_slot_end_time",
                              booking: booking.id,
                              index: slotIndex,
                              key: "date",
                              date: date
                            })
                          }
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          dateFormat="h:mm aa"
                        />
                        <SvgButtonWrapper>
                          <SvgButton
                            svg={RemoveSvg}
                            width={20}
                            height={20}
                            onClick={() =>
                              handleChangeQuote({
                                type: "quote_remove_slot",
                                booking: booking.id,
                                index: slotIndex
                              })
                            }
                          />
                        </SvgButtonWrapper>
                      </React.Fragment>
                    );
                  case "single-day":

                    return (
                      <React.Fragment key={slotIndex}>
                        <DatePicker
                          selected={new Date(slot.date)}
                          onChange={date =>
                            handleChangeQuote({
                              type: "quote_update_slot",
                              booking: booking.id,
                              index: slotIndex,
                              key: "date",
                              value: date
                            })
                          }
                          dateFormat="dd/MM/yyyy"
                        />
                        <DatePicker
                          selected={updatedDate(
                            new Date(),
                            slot.startHour,
                            slot.startMinute
                          )}
                          onChange={date =>
                            handleChangeQuote({
                              type: "quote_update_slot_start_time",
                              booking: booking.id,
                              index: slotIndex,
                              key: "date",
                              date: date
                            })
                          }
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          dateFormat="h:mm aa"
                        />
                        <DatePicker
                          selected={updatedDate(
                            new Date(),
                            slot.endHour,
                            slot.endMinute
                          )}
                          onChange={date =>
                            handleChangeQuote({
                              type: "quote_update_slot_end_time",
                              booking: booking.id,
                              index: slotIndex,
                              key: "date",
                              date: date
                            })
                          }
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          dateFormat="h:mm aa"
                        />
                        <SvgButtonWrapper>
                          <SvgButton
                            svg={RemoveSvg}
                            width={20}
                            height={20}
                            onClick={() =>
                              handleChangeQuote({
                                type: "quote_remove_slot",
                                booking: booking.id,
                                index: slotIndex
                              })
                            }
                          />
                        </SvgButtonWrapper>
                      </React.Fragment>
                    );
                  default:
                    throw new Error();
                }
              })
              .flat()}
          </Table>
        )}
        <div style={{ display: "flex" }}>
          <OutlinedButton
            style={{ marginTop: 10 }}
            onClick={() =>
              handleChangeQuote({
                type: "quote_append_slot",
              })
            }
            iconComponent={() => <AddGlyph fill={colors.grey} />}
          >
            Add Single Date
          </OutlinedButton>
          <OutlinedButton
            style={{ marginTop: 10, marginLeft: 10 }}
            onClick={() =>
              handleChangeQuote({
                type: "quote_append_slot_multi",
              })
            }
            iconComponent={() => <AddGlyph fill={colors.grey} />}
          >
            Add Date Range
          </OutlinedButton>
        </div>
        {/* COST ITEMS */}
        <TableSectionHeader title={"Cost Items"} />
        {selectedQuote.costItems && selectedQuote.costItems.length > 0 && (
          <Table
            columns="2fr 2fr 0.5fr 0.8fr 1fr 1fr auto"
            columnTitles={[
              "Name",
              "Description",
              "Quantity",
              "VAT Rate (%)",
              "Unit Price",
              "Total",
              ""
            ]}
          >
            {selectedQuote.costItems.map((item, costItemIndex) => {
              return (
                <React.Fragment key={costItemIndex}>
                  <TableEditableValue
                    value={item.name}
                    placeholder="Item Name"
                    tabIndex="0"
                    onChange={value =>
                      handleChangeQuote({
                        type: "update_cost_item",
                        key: "name",
                        value: value,
                        booking: booking.id,
                        index: costItemIndex
                      })
                    }
                  />
                  <TableEditableValue
                    value={item.description}
                    placeholder="Description"
                    tabIndex="1"
                    onChange={value =>
                      handleChangeQuote({
                        type: "update_cost_item",
                        key: "description",
                        value: value,
                        booking: booking.id,
                        index: costItemIndex
                      })
                    }
                  />
                  <TableEditableValue
                    value={item.quantity}
                    placeholder="Quantity"
                    type="number"
                    onChange={value =>
                      handleChangeQuote({
                        type: "update_cost_item",
                        key: "quantity",
                        value: value,
                        booking: booking.id,
                        index: costItemIndex
                      })
                    }
                  />
                  <TableEditableValue
                    value={item.vatRateText}
                    placeholder="VAT"
                    type="number"
                    onChange={value => {
                      handleChangeQuote({
                        type: "update_cost_item",
                        key: "vatRate",
                        value:
                          (value &&
                            value.length &&
                            parseFloat(value).toFixed(2)) ||
                          0,
                        booking: booking.id,
                        index: costItemIndex
                      });
                      handleChangeQuote({
                        type: "update_cost_item",
                        key: "vatRateText",
                        value: value,
                        booking: booking.id,
                        index: costItemIndex
                      });
                    }}
                  />
                  <TableEditableValue
                    value={item.unitPrice}
                    placeholder="Unit Price"
                    type="number"
                    onChange={value =>
                      handleChangeQuote({
                        type: "update_cost_item",
                        key: "unitPrice",
                        value: value,
                        booking: booking.id,
                        index: costItemIndex
                      })
                    }
                  />

                  <TableValue>
                    {formatCurrency(
                      item.unitPrice * item.quantity * (1 + item.vatRate / 100),
                      state.bookings.currency
                    )}
                  </TableValue>

                  <SvgButtonWrapper>
                    <SvgButton
                      svg={RemoveSvg}
                      width={20}
                      height={20}
                      onClick={() =>
                        handleChangeQuote({
                          type: "remove_cost_item",
                          booking: booking.id,
                          index: costItemIndex
                        })
                      }
                    />
                  </SvgButtonWrapper>
                </React.Fragment>
              );
            })}
          </Table>
        )}
        <OutlinedButton
          style={{ marginTop: 10 }}
          onClick={() =>
            handleChangeQuote({
              type: "append_cost_item",
              booking: booking.id,
              vatRate: state.bookings.defaultVatRate
            })
          }
          iconComponent={() => <AddGlyph fill={colors.grey} />}
        >
          Add Cost Item
        </OutlinedButton>

        {/* Summary */}

        {selectedQuote.costItems && selectedQuote.costItems.length > 0 && (
          <Table
            rows="20px 20px 20px 20px"
            columns="5fr 1fr 1fr"
            style={{ marginTop: "1em" }}
          >
            <span>&nbsp;</span>
            <TableLabel>Net subtotal</TableLabel>
            <TableValue>{formatCurrency(netSubtotal, "GBP")}</TableValue>

            <span>&nbsp;</span>
            <TableLabel>Discount (%)</TableLabel>
            <input
              style={{
                fontFamily: "Circular Std",
                fontSize: "0.9em",
                width: 80,
                padding: 3
              }}
              type="number"
              value={booking.discountText || selectedQuote.discount || ""}
              placeholder={"Discount"}
              onChange={event =>
                handleChangeQuote({
                  type: "quote_update_discount",
                  booking: booking.id,
                  value: event.target.value
                })
              }
            />

            <span>&nbsp;</span>
            <TableLabel>Taxes</TableLabel>
            <TableValue>{formatCurrency(taxes, "GBP")}</TableValue>

            <span>&nbsp;</span>
            <TableLabel>Grand Total</TableLabel>
            <TableValue>{formatCurrency(grandTotal, "GBP")}</TableValue>
          </Table>
        )}

        {/* Notes */}

        <TableSectionHeader title={"Notes"} />

        <TableEditableValue
          // label="Notes"
          placeholder={"Optionally leave a note for the customer"}
          value={(selectedQuote.note) ? selectedQuote.note : ""}
          longText
          style={{
            width: "100%"
          }}
          onChange={value => {
            handleChangeQuote({
              type: "set_quote_value",
              booking: booking.id,
              key: "note",
              value
            });
          }}
        />
      </ModalBottomSection>
    </ModalContainer>
  );
};

export default EditQuote;
