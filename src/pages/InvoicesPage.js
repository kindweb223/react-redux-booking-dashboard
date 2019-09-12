import React, {useState, useContext, useEffect} from "react";
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
import SpinnerContainer from "../components/layout/Spinner";
import {
  DELETE_BOOKING_INVOICE_ERROR, DELETE_BOOKING_INVOICE_SUCCESS,
  GET_BOOKING_BOOKINGSATTUS_ERROR,
  GET_BOOKING_BOOKINGSTATUS_SUCCESS,
  GET_BOOKING_INVOICE_ERROR, GET_BOOKING_INVOICE_SUCCESS, GET_BOOKING_SETTINGS_ERROR, GET_BOOKING_SETTINGS_SUCCESS,
  GET_BOOKINGS_ERROR,
  GET_BOOKINGS_SUCCESS,
  GET_CUSTOMERS_ERROR,
  GET_CUSTOMERS_SUCCESS, REQUEST_DELETE_BOOKING_INVOICE, REQUEST_GET_BOOKING_BOOKINGSTATUS,
  REQUEST_GET_BOOKING_INVOICE, REQUEST_GET_BOOKINGS, REQUEST_GET_CUSTOMERS, REQUEST_UPDATE_BOOKING_INVOICE,
  REUQEST_GET_BOOKING_SETTINGS, UPDATE_BOOKING_INVOICE_ERROR, UPDATE_BOOKING_INVOICE_SUCCESS
} from "../reducers/actionType";
import axios from "axios/index";

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

  const [loading, setLoading] = useState(true);
  useEffect(() => {

    setLoading(true);
    axios.all([
      axios.get('/customers'),
      axios.get('/statuses'),
      axios.get('/bookings'),
      axios.get(`/bookings/invoices/all`)
    ]).then(axios.spread(function (customers, statuses, bookings, invoices) {
      dispatch({
        type: GET_CUSTOMERS_SUCCESS,
        payload: customers.data.customers
      })

      dispatch({
        type: GET_BOOKING_BOOKINGSTATUS_SUCCESS,
        payload: statuses.data.statuses
      })

      dispatch({
        type: GET_BOOKINGS_SUCCESS,
        payload: bookings.data.bookings
      })

      dispatch({
        type: GET_BOOKING_INVOICE_SUCCESS,
        payload: invoices.data.invoices,
      })
      setLoading(false);
    }))
    .catch(error => console.log(error));
  }, [])

  const handleUpdate = async (isSave, invoice, statusValue) => {
    debugger;
    if (isSave) {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };

        dispatch({ type: REQUEST_UPDATE_BOOKING_INVOICE })

        const res = await axios.put(
          `/bookings/${invoice.BookingId}/invoices/${invoice.id}`,
          {
            slots: JSON.stringify(invoice.slots),
            cost_items: JSON.stringify(invoice.costItems),
            value: invoice.value,
            payment_method: invoice.paymentMethod,
            discount: invoice.discount,
            customerId: invoice.customerId,
            sub_total: invoice.amount,
            // tax: saveOne.amount,
            grand_total: invoice.grand_total,
            status: statusValue || invoice.status,
          },
          config
        )

        dispatch({
          type: UPDATE_BOOKING_INVOICE_SUCCESS,
          payload: res.data.invoice
        })

      } catch (err) {
        dispatch({ type: UPDATE_BOOKING_INVOICE_ERROR });
      }
    }

    setshowCreateInvoiceModal(false);
  }

  const handleDelete = async (invoice) => {

    try {
      dispatch({ type: REQUEST_DELETE_BOOKING_INVOICE });

      const res = await axios.delete(`/bookings/${invoice.BookingId}/invoices/${invoice.id}`);

      dispatch({
        type: DELETE_BOOKING_INVOICE_SUCCESS,
        payload: invoice.id,
      })
    } catch (err) {
      dispatch({ type: DELETE_BOOKING_INVOICE_ERROR })
    }
  }

  const getBookingNameWithId = (bookingId) => {
    const filteredOne = state.bookings.bookings.filter(item => item.id === bookingId);
    if (filteredOne.length > 0)
      return filteredOne[0].eventName;
    else return "";
  }

  const invoices = state.bookings.invoices
    .filter(invoice => invoice !== null)
    .flat()
    .filter(invoice => {
      const customerName =  (invoice.customerId && state.customers.customers && state.customers.customers.find(c => c.id === invoice.customerId) &&
        state.customers.customers.find(c => c.id === invoice.customerId).name) || "N/A";
      const bookingName =  (invoice.BookingId && state.bookings.bookings && state.bookings.bookings.find(c => c.id === invoice.BookingId) &&
        state.bookings.bookings.find(c => c.id === invoice.BookingId).eventName) || "N/A"

      return (
        (invoice.status === selectedFilter || selectedFilter === "All") && // apply filters
        (!searchQuery ||
          invoice.number && invoice.number.toString() === searchQuery ||
          customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bookingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invoice.booking && invoice.booking.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
      );
    })
    .sort((inv1, inv2) => (inv1.created > inv2.created ? -1 : 1));

  return (
    <>
      <SpinnerContainer loading={(loading || state.bookings.loadingInvoice).toString()} />
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

      {!loading && invoices && invoices.length > 0 && (
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
                <TableValue>{invoice.number || (index + 1)}</TableValue>
                {/* created */}
                <TableValue>{formatEventDate(invoice.created)}</TableValue>
                {/* customer */}
                <TableValue>
                  {
                    (invoice.customerId && state.customers.customers && state.customers.customers.find(c => c.id === invoice.customerId) &&
                    state.customers.customers.find(c => c.id === invoice.customerId).name) || "N/A"
                  }
                </TableValue>
                {/* booking */}
                <TableValue>
                  {/* {
                    (invoice.BookingId && state.bookings.bookings && state.bookings.bookings.find(c => c.id === invoice.BookingId) &&
                      state.bookings.bookings.find(c => c.id === invoice.BookingId).eventName) || "N/A"
                  } */}
                  {getBookingNameWithId(invoice.BookingId)}
                </TableValue>
                {/* amount */}
                <TableValue>
                  {formatCurrency(invoice.grand_total || 0, state.bookings.currency)}
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
                      index: index,
                      status: status
                    });
                    handleUpdate(true, invoice, status)
                  }}
                />
                {/* actions */}
                <SvgButton
                  width={24}
                  height={24}
                  svg={viewGlyph}
                  onClick={() => {
                    setSelectedInvoiceCoordinates({
                      booking: invoice.id,
                      index: index
                    })
                  }}
                />
                <DropdownMenu
                  items={["Delete"]}
                  colors={["#D13636"]}
                  onItemSelected={item => {
                    handleDelete(invoice)
                    dispatch({
                      type: "delete_invoice",
                      ...invoice.coordinates,
                      invoice: item.id,
                      index: index
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
        <InvoiceDetail
          invoice={selectedInvoiceCoordinates}
          handleUpdate={(invoice, invoiceId)=> {
            handleUpdate(invoice, invoiceId)
          }}
        />
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
          booking={state.bookings.bookings.find(
            b => b.id === selectedBookingIdForNewInvoice
          )}
          // onEndEditing={() => {
          //   setshowCreateInvoiceModal(false);
          // }}
          onEndEditing={handleUpdate}
        />
      </Modal>
    </>
  );
};

export default InvoicesPage;
