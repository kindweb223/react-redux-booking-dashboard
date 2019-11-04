import React, { useContext } from "react";
import InvoiceDetailEdit from "./invoiceDetailEdit";
import { createEmptyInvoice } from "../../../models/bookings";
import { AppReducerContext } from "../../../contexts/AppReducerContext";

const NewInvoice = props => {
  const { booking, onEndEditing, invoiceNumber } = props;
  // const { dispatch } = useContext(AppReducerContext);
  const newInvoice = createEmptyInvoice(invoiceNumber, booking);

  return (
    <InvoiceDetailEdit
      invoice={newInvoice}
      onEndEditing={(invoice, save) => {
        if (save) {
          // dispatch({
          //   type: "append_invoice",
          //   booking: booking.id,
          //   invoice: invoice
          // });
        }
        onEndEditing(save, invoice);
      }}
    />
  );
};

export default NewInvoice;
