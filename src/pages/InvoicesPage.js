import React, { useState, useContext } from "react";
import Modal from "../components/modals/modal";
import { Table, TableValue } from "../components/tables/tables";
import AddGlyph from "../images/Glyphs/AddGlyph";
import SvgButton from "../components/buttons/SvgButton";
import colors from "../components/style/colors";
import viewGlyph from "../images/Glyphs/view.svg";
import Button from "../components/buttons/Button";
import DropdownMenu from "../components/buttons/DropdownMenu";
import { AppReducerContext } from "../contexts/AppReducerContext";
import P1 from "../components/typography/P1";
import BigTabbedFilter from "../components/features/BigTabbedFilter";
import { formatEventDate } from "../utils/dateFormatting";
import { formatCurrency } from "../utils/numbers";
import PickerButton from "../components/buttons/PickerButton";
import InvoiceDetail from "../components/features/invoices/invoiceDetail";
import { invoiceStates, invoiceStatesColors } from "../models/invoices";
import SearchField from "../components/inputs/searchField";
import { css } from "emotion";
import SelectBookingModal from "../components/features/invoices/selectBooking";
import NewInvoice from "../components/features/invoices/newInvoice";

const InvoicesPage = () => {
  const [selectedInvoiceCoordinates, setSelectedInvoiceCoordinates] = useState(
    null
    // { booking: "99af5d47-3837-4623-be55-f85c0b511c0f", index: 0 }
  ); // booking id + index of the invoice

  const [showSelectBookingModal, setshowSelectBookingModal] = useState(
    false
    // true
  );
  const [
    selectedBookingIdForNewInvoice,
    setSelectedBookingIdForNewInvoice
  ] = useState(null);
  const [showCreateInvoiceModal, setshowCreateInvoiceModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const { state, dispatch } = useContext(AppReducerContext);
  const [searchQuery, setSearchQuery] = useState("");

  const invoices = state.bookings
    .map(booking => {
      if (booking.invoices && booking.invoices.length > 0) {
        return booking.invoices.map((invoice, index) => ({
          ...invoice,
          booking: booking,
          coordinates: {
            booking: booking.id,
            index: index
          }
        }));
      } else {
        return null;
      }
    })
    .filter(invoice => invoice !== null)
    .flat()
    .filter(invoice => {
      const customerName = state.customers.find(
        c => c.id === invoice.booking.customer
      ).name;

      return (
        (invoice.status === selectedFilter || selectedFilter === "All") && // apply filters
        (!searchQuery ||
          invoice.number.toString() === searchQuery ||
          customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invoice.booking.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
      );
    })
    .sort((inv1, inv2) => (inv1.created > inv2.created ? -1 : 1));

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 40
        }}
      >
        <div
          className={css`
            display: flex;
            align-items: center;
            width: 100%;
          `}
        >
          <SearchField
            query={searchQuery}
            placeholder={"Search Invoices"}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <BigTabbedFilter
            items={invoiceStates}
            colors={invoiceStatesColors}
            selectedItem={selectedFilter}
            onSelect={setSelectedFilter}
            style={{
              marginBottom: 0,
              marginTop: 0,
              maxWidth: 350,
              height: 40
            }}
          />
        </div>
        <Button
          primary
          iconComponent={() => <AddGlyph fill={colors.white} />}
          style={{ marginLeft: "2em" }}
          onClick={() => setshowSelectBookingModal(true)}
        >
          Add Invoice
        </Button>
      </div>

      {invoices && invoices.length > 0 && (
        <Table
          columns="50px auto auto auto auto 150px 50px 50px"
          columnTitles={[
            "#",
            "Created",
            "Customer",
            "Booking",
            "Amount",
            "Status",
            "",
            ""
          ]}
        >
          {invoices.map((invoice, index) => {
            return (
              <React.Fragment key={index}>
                {/* number */}
                <TableValue>{invoice.number}</TableValue>
                {/* created */}
                <TableValue>{formatEventDate(invoice.created)}</TableValue>
                {/* customer */}
                <TableValue>
                  {
                    state.customers.find(c => c.id === invoice.booking.customer)
                      .name
                  }
                </TableValue>
                {/* booking */}
                <TableValue>{invoice.booking.title}</TableValue>
                {/* amount */}
                <TableValue>
                  {formatCurrency(invoice.amount, state.settings.currency)}
                </TableValue>
                {/* status */}
                <PickerButton
                  options={invoiceStates}
                  colors={invoiceStatesColors}
                  selectedOption={invoice.status}
                  onOptionSelected={status => {
                    dispatch({
                      type: "update_invoice_status",
                      ...invoice.coordinates,
                      status: status
                    });
                  }}
                />
                {/* actions */}
                <SvgButton
                  width={24}
                  height={24}
                  svg={viewGlyph}
                  onClick={() =>
                    setSelectedInvoiceCoordinates(invoice.coordinates)
                  }
                />
                <DropdownMenu
                  items={["Delete"]}
                  colors={["#D13636"]}
                  onItemSelected={item => {
                    dispatch({
                      type: "delete_invoice",
                      ...invoice.coordinates
                    });
                  }}
                />
              </React.Fragment>
            );
          })}
        </Table>
      )}

      {invoices.length === 0 && (
        <P1>
          There are no matching invoices.{" "}
          <span
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => {
              setSelectedFilter("All");
              setSearchQuery("");
            }}
          >
            View All
          </span>
        </P1>
      )}

      <Modal
        isOpen={selectedInvoiceCoordinates !== null}
        onClose={() => setSelectedInvoiceCoordinates(null)}
      >
        <InvoiceDetail invoice={selectedInvoiceCoordinates} />
      </Modal>
      <Modal
        isOpen={showSelectBookingModal}
        onClose={() => setshowSelectBookingModal(false)}
        width="30em"
      >
        <SelectBookingModal
          onSelectBooking={bookingId => {
            setSelectedBookingIdForNewInvoice(bookingId);
            setshowSelectBookingModal(false);
            setshowCreateInvoiceModal(true);
          }}
        />
      </Modal>
      <Modal
        isOpen={showCreateInvoiceModal}
        onClose={() => setshowCreateInvoiceModal(false)}
      >
        <NewInvoice
          invoiceNumber={invoices.length + 1}
          booking={state.bookings.find(
            b => b.id === selectedBookingIdForNewInvoice
          )}
          onEndEditing={() => {
            setshowCreateInvoiceModal(false);
          }}
        />
      </Modal>
    </>
  );
};

export default InvoicesPage;
