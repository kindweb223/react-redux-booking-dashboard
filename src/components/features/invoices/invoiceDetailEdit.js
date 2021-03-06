import React, { useReducer, useContext } from "react";
import H3 from "../../typography/H3";
import Button from "../../buttons/Button";
import Grid from "../../layout/Grid";
import {
  TableItem,
  TableSectionHeader,
  TableValue,
  Table,
  TableLabel,
  TablePicker,
  TableEditableValue
} from "../../tables/Tables";
import {
  ModalContainer,
  ModalTopSection,
  ModalTitleAndButtons,
  ModalBottomSection
} from "../../modals/containers";
import { formatEventDate } from "../../../utils/dateFormatting";
import { invoicePaymentMethods } from "../../../models/invoices";
import { AppReducerContext } from "../../../contexts/AppReducerContext";
import { formatCurrency } from "../../../utils/numbers";
import { computeCostItemsSummary } from "../../../utils/costItemsMath";
import invoiceDetailEditReducer from "./invoiceDetailEditReducer";
import DatePicker from "react-datepicker";
import { updatedDate } from "../../../utils/dates";
import SvgButton from "../../buttons/SvgButton";
import styled from "styled-components";
import OutlinedButton from "../../buttons/OutlinedButton";
import colors from "../../style/Colors";
import RemoveSvg from "../../../images/ui/remove.svg";
import AddGlyph from "../../../images/Glyphs/AddGlyph";
import SpinnerContainer from "../../../components/layout/Spinner"

const SvgButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InvoiceDetailEdit = props => {
  const { invoice: invoiceBeingEdited, onEndEditing } = props;
  const { state } = useContext(AppReducerContext);
  const [invoice, dispatch] = useReducer(
    invoiceDetailEditReducer,
    invoiceBeingEdited
  );

  const [netSubtotal, taxes, grandTotal] = computeCostItemsSummary(
    invoice.costItems,
    invoice.discount
  );
  
  const getBookingTitle = (bookingId) => {
    const filteredBooking = state.bookings.bookings.filter(item => item.id === bookingId)
    if (filteredBooking.length > 0)
      return filteredBooking[0].eventName;
    else return '';
  }

  return (
    <ModalContainer>
      <ModalTopSection>
        <ModalTitleAndButtons>
          <H3 style={{ margin: 0 }}>Invoice #{invoice.number || props.invoice.coordinates.index + 1}</H3>
          <div>
            <Button
              style={{ marginRight: 10 }}
              onClick={() => onEndEditing(invoice, false)}
            >
              Cancel
            </Button>
            <Button
              primary
              style={{ marginRight: 10 }}
              onClick={() => onEndEditing(invoice, true)}
            >
              Save
            </Button>
          </div>
        </ModalTitleAndButtons>
      </ModalTopSection>

      <ModalBottomSection>
        <SpinnerContainer loading={state.bookings.loadingInvoice.toString()} />
        <Grid columns="1fr 1fr" style={{ width: "100%" }}>
          <TableItem
            label={"Created"}
            value={formatEventDate(invoice.created)}
          />
          <TableItem 
            label={"Booking"} 
            value={getBookingTitle(invoice.booking.id)} 
          />
          <TableItem
            label={"Customer"}
            // value={
            //   (invoice.customerId && state.customers.customers && state.customers.customers.find(c => c.id === invoice.customerId) &&
            //     state.customers.customers.find(c => c.id === invoice.customerId).name) || "N/A"
            // }
            value={invoice.booking.customer.name}
          />
          <TablePicker
            label="Payment Method"
            options={invoicePaymentMethods}
            selectedOption={invoice.payment_method}
            onOptionSelected={value => {
              dispatch({
                type: "update_value",
                key: "payment_method",
                value: value
              });
            }}
          />
        </Grid>

        {/* Booking Slots */}
        <TableSectionHeader title={"Booking Slots"} />
        {invoice.slots && invoice.slots.length > 0 && (
          <Table
            columns="1fr 1fr 1fr auto"
            columnTitles={["Date", "Start", "End", ""]}
          >
            {invoice.slots
              .map((slot, slotIndex) => {
                switch (slot.kind) {
                  case "multi-day":
                    const startDate = slot.dateRange[0];
                    const endDate = slot.dateRange[slot.dateRange.length - 1];
                    return (
                      <React.Fragment key={slotIndex}>
                        <div style={{ display: "flex" }}>
                          <DatePicker
                            selected={new Date(startDate).getTime()}
                            startDate={startDate}
                            endDate={endDate}
                            selectsEnd
                            onChange={date => {
                              dispatch({
                                type: "update_multiday_slot_start",
                                index: slotIndex,
                                value: date
                              });
                            }}
                            dateFormat="dd/MM/yyyy"
                          />
                          <DatePicker
                            selected={new Date(endDate).getTime()}
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            selectsEnd
                            onChange={date => {
                              dispatch({
                                type: "update_multiday_slot_end",
                                index: slotIndex,
                                value: date
                              });
                            }}
                            dateFormat="dd/MM/yyyy"
                          />
                        </div>
                        <DatePicker
                          selected={updatedDate(
                            new Date(),
                            slot.startHour,
                            slot.startMinute
                          )}
                          onChange={date => {
                            dispatch({
                              type: "update_slot_start_time",
                              index: slotIndex,
                              key: "date",
                              date: date
                            });
                          }}
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
                          onChange={date => {
                            dispatch({
                              type: "update_slot_end_time",
                              index: slotIndex,
                              key: "date",
                              date: date
                            });
                          }}
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
                            onClick={() => {
                              dispatch({
                                type: "remove_slot",
                                index: slotIndex
                              });
                            }}
                          />
                        </SvgButtonWrapper>
                      </React.Fragment>
                    );
                  case "single-day":
                    return (
                      <React.Fragment key={slotIndex}>
                        <DatePicker
                          selected={new Date(slot.date).getTime()}
                          onChange={date => {
                            dispatch({
                              type: "update_slot",
                              index: slotIndex,
                              key: "date",
                              value: date
                            });
                          }}
                          dateFormat="dd/MM/yyyy"
                        />
                        <DatePicker
                          selected={updatedDate(
                            new Date(),
                            slot.startHour,
                            slot.startMinute
                          )}
                          onChange={date => {
                            dispatch({
                              type: "update_slot_start_time",
                              index: slotIndex,
                              key: "date",
                              date: date
                            });
                          }}
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
                          onChange={date => {
                            dispatch({
                              type: "update_slot_end_time",
                              index: slotIndex,
                              key: "date",
                              date: date
                            });
                          }}
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
                            onClick={() => {
                              dispatch({
                                type: "remove_slot",
                                index: slotIndex
                              });
                            }}
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
            onClick={() => {
              dispatch({
                type: "append_slot"
              });
            }}
            iconComponent={() => <AddGlyph fill={colors.grey} />}
          >
            Add Single Date
          </OutlinedButton>
          <OutlinedButton
            style={{ marginTop: 10, marginLeft: 10 }}
            onClick={() => {
              dispatch({
                type: "append_slot_multi"
              });
            }}
            iconComponent={() => <AddGlyph fill={colors.grey} />}
          >
            Add Date Range
          </OutlinedButton>
        </div>

        {/* COST ITEMS */}
        <TableSectionHeader title={"Cost Items"} />
        {invoice.costItems && invoice.costItems.length > 0 && (
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
            {invoice.costItems && invoice.costItems.map((item, costItemIndex) => {
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
                        index: costItemIndex
                      })
                    }
                  />
                  <TableEditableValue
                    value={item.quantity}
                    placeholder="Quantity"
                    type="number"
                    onChange={value => {
                      dispatch({
                        type: "update_cost_item",
                        key: "quantity",
                        value: value,
                        index: costItemIndex
                      });
                    }}
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
                        index: costItemIndex
                      });
                      dispatch({
                        type: "update_cost_item",
                        key: "vatRateText",
                        value: value,
                        index: costItemIndex
                      });
                    }}
                  />
                  <TableEditableValue
                    value={item.unitPrice}
                    placeholder="Unit Price"
                    type="number"
                    onChange={value => {
                      dispatch({
                        type: "update_cost_item",
                        key: "unitPrice",
                        value: value,
                        index: costItemIndex
                      });                      
                    }}
                  />

                  <TableValue>
                    {formatCurrency(
                      item.unitPrice * item.quantity * (1 + item.vatRate / 100),
                      state.settings.companyInfo.currency
                    )}
                  </TableValue>

                  <SvgButtonWrapper>
                    <SvgButton
                      svg={RemoveSvg}
                      width={20}
                      height={20}
                      onClick={() => {
                        dispatch({
                          type: "remove_cost_item",
                          index: costItemIndex
                        });
                      }}
                    />
                  </SvgButtonWrapper>
                </React.Fragment>
              );
            })}
          </Table>
        )}
        <OutlinedButton
          style={{ marginTop: 10 }}
          onClick={() => {
            dispatch({
              type: "append_cost_item",
              vatRate: state.settings.companyInfo.vatRate,              
            });
          }}
          iconComponent={() => <AddGlyph fill={colors.grey} />}
        >
          Add Cost Item
        </OutlinedButton>

        <Table
          rows="auto auto auto auto"
          columns="4fr 1fr"
          gap="0.8em"
          style={{ marginTop: "2em" }}
        >
          <TableLabel tall right>
            Net subtotal
          </TableLabel>
          <TableValue>
            {formatCurrency(netSubtotal || 0, state.settings.companyInfo.currency)}
          </TableValue>

          <TableLabel tall right>
            Discount (%)
          </TableLabel>
          <input
            style={{
              fontFamily: "Circular Std",
              fontSize: "0.9em",
              width: 80,
              padding: 3
            }}
            type="number"
            value={invoice.discountText || invoice.discount || ""}
            placeholder={"Discount"}
            onChange={event =>
              dispatch({
                type: "update_discount",
                value: event.target.value
              })
            }
          />

          <TableLabel tall right>
            Taxes
          </TableLabel>
          <TableValue>
            {formatCurrency(taxes || 0, state.settings.companyInfo.currency)}
          </TableValue>

          <TableLabel tall right>
            Grand Total
          </TableLabel>
          <TableValue>
            {formatCurrency(grandTotal || 0, state.settings.companyInfo.currency)}
          </TableValue>
        </Table>
      </ModalBottomSection>
    </ModalContainer>
  );
};

export default InvoiceDetailEdit;
