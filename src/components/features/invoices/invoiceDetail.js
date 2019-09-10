import React, { useState, useContext } from "react";
import H3 from "../../typography/H3";
import Button from "../../buttons/Button";
import Grid from "../../layout/Grid";
import {
  TableItem,
  TableSectionHeader,
  TableValue,
  Table,
  TableLabel
} from "../../tables/tables";
import {
  ModalContainer,
  ModalTopSection,
  ModalTitleAndButtons,
  ModalBottomSection
} from "../../modals/containers";
import {
  formatEventDate,
  formatSlotStartEndTime
} from "../../../utils/dateFormatting";
import PickerButton from "../../buttons/PickerButton";
import { invoiceStates, invoiceStatesColors } from "../../../models/invoices";
import { AppReducerContext } from "../../../contexts/AppReducerContext";
import { formatPercentage, formatCurrency } from "../../../utils/numbers";
import { computeCostItemsSummary } from "../../../utils/costItemsMath";
import InvoiceDetailEdit from "./invoiceDetailEdit";

const InvoiceDetail = props => {
  const { invoice: invoiceCoordinates, handleUpdate } = props;
  const [editing, setEditing] = useState(
    // true
    false
  );
  const { state, dispatch } = useContext(AppReducerContext);

  if (!invoiceCoordinates) {
    return null;
  }

  const booking = state.bookings.bookings && state.bookings.bookings.find(b => b.id === invoiceCoordinates.booking);
  const invoice = {
    ...state.bookings.invoices[invoiceCoordinates.index],
    coordinates: invoiceCoordinates,
    booking: booking
  };

  if (editing) {
    return (
      <InvoiceDetailEdit
        invoice={invoice}
        onEndEditing={(editedInvoice, save) => {
          if (save) {
            // dispatch({
            //   type: "update_invoice",
            //   ...invoiceCoordinates,
            //   invoice: editedInvoice
            // });
            handleUpdate(editedInvoice, save)
          }
          setEditing(false);
        }}
      />
    );
  }

  const [netSubtotal, taxes, grandTotal] = computeCostItemsSummary(
    invoice.costItems,
    invoice.discount
  );

  return (
    <ModalContainer>
      <ModalTopSection>
        <ModalTitleAndButtons>
          <H3 style={{ margin: 0 }}>Invoice #{props.invoice.index + 1}</H3>
          <div>
            <PickerButton
              style={{ minWidth: 80, marginRight: 10 }}
              options={invoiceStates}
              colors={invoiceStatesColors}
              selectedOption={invoice.status}
              onOptionSelected={opt => {
                dispatch({
                  type: "update_invoice_status",
                  ...invoice.coordinates,
                  status: opt
                });
              }}
            />
            <Button style={{ marginRight: 10 }}>Export</Button>
            <Button
              primary
              style={{ marginRight: 10 }}
              onClick={() => setEditing(!editing)}
            >
              Edit
            </Button>
          </div>
        </ModalTitleAndButtons>
      </ModalTopSection>

      <ModalBottomSection>
        <Grid columns="1fr 1fr" style={{ width: "100%" }}>
          <TableItem
            label={"Created"}
            value={formatEventDate(invoice.created)}
          />
          <TableItem label={"Booking"} value={invoice.booking && invoice.booking.title} />
          <TableItem
            label={"Customer"}
            value={
              (invoice.customerId && state.customers.customers && state.customers.customers.find(c => c.id === invoice.customerId) &&
                state.customers.customers.find(c => c.id === invoice.customerId).name) || "N/A"
            }
          />
          <TableItem
            label={"Payment Method"}
            value={invoice.payment_method || "N/A"}
          />
        </Grid>

        <TableSectionHeader title={"Booking Slots"} />
        <Table columns="20% auto" columnTitles={["Date", "Time"]}>
          {invoice.slots.length > 0 && invoice.slots
            .map(slot => {
              switch (slot.kind) {
                case "multi-day":
                  return slot.dateRange.map(date => (
                    <React.Fragment key={invoice.number + date.toString()}>
                      <TableValue>{formatEventDate(date)}</TableValue>
                      <TableValue>
                        {formatSlotStartEndTime(date, slot)}
                      </TableValue>
                    </React.Fragment>
                  ));
                case "single-day":
                  return (
                    <React.Fragment key={invoice.number + slot.date.toString()}>
                      <TableValue>{formatEventDate(slot.date)}</TableValue>
                      <TableValue>
                        {formatSlotStartEndTime(slot.date, slot)}
                      </TableValue>
                    </React.Fragment>
                  );
                default:
                  throw new Error();
              }
            })
            .flat()}
        </Table>

        <TableSectionHeader title={"Cost Items"} />
        <Table
          columns="2fr 2fr 1fr 1fr 1fr 1fr"
          columnTitles={[
            "Name",
            "Description",
            "Quantity",
            "Unit Price",
            "VAT Rate",
            "Total"
          ]}
        >
          {invoice.costItems && invoice.costItems.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <TableValue>{item.name}</TableValue>
                <TableValue>
                  {!!item.description ? item.description : "No description"}
                </TableValue>
                <TableValue>{item.quantity}</TableValue>
                <TableValue>{item.unitPrice}</TableValue>
                <TableValue>{formatPercentage(item.vatRate / 100)}</TableValue>
                <TableValue>
                  {formatCurrency(
                    item.unitPrice * item.quantity * (1 + item.vatRate),
                    state.bookings.currency
                  )}
                </TableValue>
              </React.Fragment>
            );
          })}
        </Table>

        <Table
          rows="auto auto auto auto"
          columns="4fr 1fr 1fr"
          gap="0.8em"
          style={{ marginTop: "2em" }}
        >
          <span>&nbsp;</span>
          <TableLabel tall right>
            Net subtotal
          </TableLabel>
          <TableValue>
            {formatCurrency(netSubtotal || 0, state.bookings.currency)}
          </TableValue>

          <span>&nbsp;</span>
          <TableLabel tall right>
            Discount
          </TableLabel>
          <TableValue>{formatPercentage(invoice.discount / 100)}</TableValue>

          <span>&nbsp;</span>
          <TableLabel tall right>
            Taxes
          </TableLabel>
          <TableValue>
            {formatCurrency(taxes || 0, state.bookings.currency)}
          </TableValue>

          <span>&nbsp;</span>
          <TableLabel tall right>
            Grand Total
          </TableLabel>
          <TableValue>
            {formatCurrency(grandTotal || 0, state.bookings.currency)}
          </TableValue>
        </Table>
      </ModalBottomSection>
    </ModalContainer>
  );
};

export default InvoiceDetail;
