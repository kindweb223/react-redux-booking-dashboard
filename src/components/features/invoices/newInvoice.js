import React, { useContext } from "react";
import InvoiceDetailEdit from "./invoiceDetailEdit";
import { createEmptyInvoice } from "../../../models/bookings";
// import { AppReducerContext } from "../../../contexts/AppReducerContext";
// import {
//   REQUEST_APPEND_INVOICE
// } from "../../../reducers/actionType";

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
          //   type: REQUEST_APPEND_INVOICE,
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
