import React, { useContext } from "react";
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

const SvgButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EditQuote = props => {
  const { booking, quote, index: quoteIndex, onEndEditing } = props;

  const { state, dispatch } = useContext(AppReducerContext);

  if (!quote) {
    return null;
  }

  const [netSubtotal, taxes, grandTotal] = computeCostItemsSummary(
    quote.costItems,
    quote.discount
  );

  return (
    <ModalContainer>
      <ModalTopSection>
        <ModalTitleAndButtons>
          <H3 style={{ margin: 0 }}>
            Quote #{quoteIndex + 1} – {formatEventDate(quote.created)}
          </H3>
          <div>
            <Button
              style={{ marginRight: 10 }}
              onClick={() => onEndEditing(false)}
            >
              Cancel
            </Button>
            <Button
              primary
              style={{ marginRight: 10 }}
              onClick={() => onEndEditing(true)}
            >
              Save
            </Button>
          </div>
        </ModalTitleAndButtons>
      </ModalTopSection>

      <ModalBottomSection>
        {/* QUOTE SLOTS */}
        <TableSectionHeader title={"Booking Slots"} />
        {quote.slots.length > 0 && (
          <Table
            columns="1fr 1fr 1fr auto"
            columnTitles={["Date", "Start", "End", ""]}
          >
            {quote.slots
              .map((slot, slotIndex) => {
                switch (slot.kind) {
                  case "multi-day":
                    const startDate = slot.dateRange[0];
                    const endDate = slot.dateRange[slot.dateRange.length - 1];
                    return (
                      <React.Fragment key={slotIndex}>
                        <div style={{ display: "flex" }}>
                          <DatePicker
                            selected={startDate}
                            startDate={startDate}
                            endDate={endDate}
                            selectsEnd
                            onChange={date =>
                              dispatch({
                                type: "quote_update_multiday_slot_start",
                                booking: booking.id,
                                quote: quoteIndex,
                                index: slotIndex,
                                value: date
                              })
                            }
                          />
                          <DatePicker
                            selected={endDate}
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            selectsEnd
                            onChange={date =>
                              dispatch({
                                type: "quote_update_multiday_slot_end",
                                booking: booking.id,
                                quote: quoteIndex,
                                index: slotIndex,
                                value: date
                              })
                            }
                          />
                        </div>
                        <DatePicker
                          selected={updatedDate(
                            new Date(),
                            slot.startHour,
                            slot.startMinute
                          )}
                          onChange={date =>
                            dispatch({
                              type: "quote_update_slot_start_time",
                              booking: booking.id,
                              quote: quoteIndex,
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
                            dispatch({
                              type: "quote_update_slot_end_time",
                              booking: booking.id,
                              quote: quoteIndex,
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
                              dispatch({
                                type: "quote_remove_slot",
                                booking: booking.id,
                                quote: quoteIndex,
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
                          selected={slot.date}
                          onChange={date =>
                            dispatch({
                              type: "quote_update_slot",
                              booking: booking.id,
                              quote: quoteIndex,
                              index: slotIndex,
                              key: "date",
                              value: date
                            })
                          }
                        />
                        <DatePicker
                          selected={updatedDate(
                            new Date(),
                            slot.startHour,
                            slot.startMinute
                          )}
                          onChange={date =>
                            dispatch({
                              type: "quote_update_slot_start_time",
                              booking: booking.id,
                              quote: quoteIndex,
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
                            dispatch({
                              type: "quote_update_slot_end_time",
                              booking: booking.id,
                              quote: quoteIndex,
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
                              dispatch({
                                type: "quote_remove_slot",
                                booking: booking.id,
                                quote: quoteIndex,
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
              dispatch({
                type: "quote_append_slot",
                booking: booking.id,
                quote: quoteIndex
              })
            }
            iconComponent={() => <AddGlyph fill={colors.grey} />}
          >
            Add Single Date
          </OutlinedButton>
          <OutlinedButton
            style={{ marginTop: 10, marginLeft: 10 }}
            onClick={() =>
              dispatch({
                type: "quote_append_slot_multi",
                booking: booking.id,
                quote: quoteIndex
              })
            }
            iconComponent={() => <AddGlyph fill={colors.grey} />}
          >
            Add Date Range
          </OutlinedButton>
        </div>
        {/* COST ITEMS */}
        <TableSectionHeader title={"Cost Items"} />
        {quote.costItems.length > 0 && (
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
            {quote.costItems.map((item, costItemIndex) => {
              return (
                <React.Fragment key={costItemIndex}>
                  <TableEditableValue
                    value={item.name}
                    placeholder="Item Name"
                    tabIndex="0"
                    onChange={value =>
                      dispatch({
                        type: "update_cost_item",
                        key: "name",
                        value: value,
                        booking: booking.id,
                        quote: quoteIndex,
                        index: costItemIndex
                      })
                    }
                  />
                  <TableEditableValue
                    value={item.description}
                    placeholder="Description"
                    tabIndex="1"
                    onChange={value =>
                      dispatch({
                        type: "update_cost_item",
                        key: "description",
                        value: value,
                        booking: booking.id,
                        quote: quoteIndex,
                        index: costItemIndex
                      })
                    }
                  />
                  <TableEditableValue
                    value={item.quantity}
                    placeholder="Quantity"
                    type="number"
                    onChange={value =>
                      dispatch({
                        type: "update_cost_item",
                        key: "quantity",
                        value: value,
                        booking: booking.id,
                        quote: quoteIndex,
                        index: costItemIndex
                      })
                    }
                  />
                  <TableEditableValue
                    value={item.vatRateText}
                    placeholder="VAT"
                    type="number"
                    onChange={value => {
                      dispatch({
                        type: "update_cost_item",
                        key: "vatRate",
                        value:
                          (value &&
                            value.length &&
                            parseFloat(value).toFixed(2)) ||
                          0,
                        booking: booking.id,
                        quote: quoteIndex,
                        index: costItemIndex
                      });
                      dispatch({
                        type: "update_cost_item",
                        key: "vatRateText",
                        value: value,
                        booking: booking.id,
                        quote: quoteIndex,
                        index: costItemIndex
                      });
                    }}
                  />
                  <TableEditableValue
                    value={item.unitPrice}
                    placeholder="Unit Price"
                    type="number"
                    onChange={value =>
                      dispatch({
                        type: "update_cost_item",
                        key: "unitPrice",
                        value: value,
                        booking: booking.id,
                        quote: quoteIndex,
                        index: costItemIndex
                      })
                    }
                  />

                  <TableValue>
                    {formatCurrency(
                      item.unitPrice * item.quantity * (1 + item.vatRate / 100),
                      "GBP"
                    )}
                  </TableValue>

                  <SvgButtonWrapper>
                    <SvgButton
                      svg={RemoveSvg}
                      width={20}
                      height={20}
                      onClick={() =>
                        dispatch({
                          type: "remove_cost_item",
                          booking: booking.id,
                          quote: quoteIndex,
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
            dispatch({
              type: "append_cost_item",
              booking: booking.id,
              quote: quoteIndex,
              vatRate: state.settings.defaultVatRate
            })
          }
          iconComponent={() => <AddGlyph fill={colors.grey} />}
        >
          Add Cost Item
        </OutlinedButton>

        {/* Summary */}

        {quote.costItems.length > 0 && (
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
              value={booking.discountText || quote.discount || ""}
              placeholder={"Discount"}
              onChange={event =>
                dispatch({
                  type: "quote_update_discount",
                  booking: booking.id,
                  quote: quoteIndex,
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
          value={quote.notes}
          longText
          style={{
            width: "100%"
          }}
          onChange={value => {
            dispatch({
              type: "set_quote_value",
              booking: booking.id,
              index: quoteIndex,
              key: "notes",
              value
            });
          }}
        />
      </ModalBottomSection>
    </ModalContainer>
  );
};

export default EditQuote;
