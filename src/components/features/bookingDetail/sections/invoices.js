import React, { useState, useContext } from "react";
import { Table, TableValue } from "../../../tables/tables";
import { formatEventDate } from "../../../../utils/dateFormatting";
import { formatCurrency } from "../../../../utils/numbers";
import OutlinedButton from "../../../buttons/OutlinedButton";
import addGlyph from "../../../../images/Glyphs/add.svg";
import PickerButton from "../../../buttons/PickerButton";
import { AppReducerContext } from "../../../../contexts/AppReducerContext";
import DropdownMenu from "../../../buttons/DropdownMenu";
import colors from "../../../style/colors";
import SvgButton from "../../../buttons/SvgButton";
import viewGlyph from "../../../../images/Glyphs/view.svg";
import Modal from "../../../modals/modal";
import InvoiceDetail from "../../invoices/invoiceDetail";
import NewInvoice from "../../invoices/newInvoice";

const INVOICE_STATUSES = ["Unpaid", "Paid"];

const InvoicesSection = props => {
  const { booking } = props;
  const [invoiceStatuses, setInvoiceStatuses] = useState({});
  const { state } = useContext(AppReducerContext);

  const [selectedInvoiceCoordinates, setSelectedInvoiceCoordinates] = useState(
    null
  );

  const [showCreateInvoiceModal, setshowCreateInvoiceModal] = useState(false);

  return (
    <>
      {booking.invoices && booking.invoices.length > 0 && (
        <Table
          columns="50px 120px auto auto auto 50px 50px"
          columnTitles={["#", "Created", "Amount", "Payment", "Status", "", ""]}
        >
          {booking.invoices.map((invoice, index) => {
            return (
              <React.Fragment key={index}>
                <TableValue>{invoice.number}</TableValue>
                <TableValue>{formatEventDate(invoice.created)}</TableValue>
                <TableValue>
                  {formatCurrency(invoice.amount, state.settings.currency)}
                </TableValue>
                <TableValue>{invoice.paymentMethod || "N/A"}</TableValue>
                <PickerButton
                  options={INVOICE_STATUSES}
                  selectedOption={
                    invoiceStatuses[index] ? invoiceStatuses[index] : "Unpaid"
                  }
                  onOptionSelected={status =>
                    setInvoiceStatuses({ ...invoiceStatuses, [index]: status })
                  }
                />
                <SvgButton
                  size={24}
                  svg={viewGlyph}
                  onClick={() =>
                    setSelectedInvoiceCoordinates({
                      booking: booking.id,
                      index: index
                    })
                  }
                />
                <DropdownMenu
                  items={["Export", "Delete"]}
                  colors={[colors.grey, "#D13636"]}
                  onItemSelected={item => {}}
                />
              </React.Fragment>
            );
          })}
        </Table>
      )}
      <br />
      <OutlinedButton
        primary
        icon={addGlyph}
        onClick={() => setshowCreateInvoiceModal(true)}
      >
        New Invoice
      </OutlinedButton>

      <Modal
        isOpen={selectedInvoiceCoordinates !== null}
        onClose={() => setSelectedInvoiceCoordinates(null)}
      >
        <InvoiceDetail invoice={selectedInvoiceCoordinates} />
      </Modal>

      <Modal
        isOpen={showCreateInvoiceModal}
        onClose={() => setshowCreateInvoiceModal(false)}
      >
        <NewInvoice
          invoiceNumber={
            state.bookings.reduce((acc, b) => acc + b.invoices.length, 0) + 1
          }
          booking={booking}
          onEndEditing={() => {
            setshowCreateInvoiceModal(false);
          }}
        />
      </Modal>
    </>
  );
};

export default InvoicesSection;
