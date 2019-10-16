import React, { useState, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import { Table, TableValue, TableEditableValue } from "../../../tables/tables";
import { formatEventDate } from "../../../../utils/dateFormatting";
import { formatCurrency } from "../../../../utils/numbers";
import OutlinedButton from "../../../buttons/OutlinedButton";
import addGlyph from "../../../../images/Glyphs/add.svg";
import PickerButton from "../../../buttons/PickerButton";
import { AppReducerContext, initialState, reducer } from "../../../../contexts/AppReducerContext";
import DropdownMenu from "../../../buttons/DropdownMenu";
import colors from "../../../style/colors";
import SvgButton from "../../../buttons/SvgButton";
import viewGlyph from "../../../../images/Glyphs/view.svg";
import Modal from "../../../modals/modal";
import InvoiceDetail from "../../invoices/invoiceDetail";
import NewInvoice from "../../invoices/newInvoice";
import {
  DELETE_BOOKING_INVOICE_ERROR,
  DELETE_BOOKING_INVOICE_SUCCESS,
  GET_BOOKING_INVOICE_ERROR,
  GET_BOOKING_INVOICE_SUCCESS,
  GET_CREATE_BOOKING_INVOICE_ERROR, GET_CREATE_BOOKING_INVOICE_SUCCESS,
  REQUEST_CREATE_BOOKING_INVOICE, REQUEST_DELETE_BOOKING_INVOICE, REQUEST_GET_BOOKING_INVOICE,
  REQUEST_UPDATE_BOOKING_INVOICE,
  UPDATE_BOOKING_INVOICE_ERROR,
  UPDATE_BOOKING_INVOICE_SUCCESS,
} from "../../../../reducers/actionType";
import SpinnerContainer from "../../../layout/Spinner";
import { ModalContainer, ModalTopSection, ModalBottomSection, ModalTitleAndButtons } from "../../../modals/containers";
import H3 from "../../../typography/H3";
import Button from "../../../buttons/Button";
import CONFIG from '../../../../config';
import StripeApp from "../../../stripe/stripeApp";

const INVOICE_STATUSES = ["Unpaid", "Pending", "Paid"];

const InvoicesSection = props => {


  const { booking } = props;
  const { state, dispatch } = useContext(AppReducerContext);
  const rootState = state;

  const [invoiceStatuses, setInvoiceStatuses] = useState({});

  const [selectedInvoiceCoordinates, setSelectedInvoiceCoordinates] = useState(
    null
  );

  const [showCreateInvoiceModal, setshowCreateInvoiceModal] = useState(false);
  const [showCreditCardInfoModal, setShowCreditCardInfoModal] = useState(false);
  const [invoiceState, setInvoiceState] = useState(null);

  const [paid, setPaid] = useState(false);

  const [selectedChargeData, setSelectedChargeData] = useState({});

  useEffect(() => {
    const getInvoice = async () => {

      try {
        dispatch({ type: REQUEST_GET_BOOKING_INVOICE })

        const res = await axios.get(`/bookings/${booking.id}/invoices`);

        dispatch({
          type: GET_BOOKING_INVOICE_SUCCESS,
          payload: res.data.invoices,
        })
      } catch (err) {
        dispatch({ GET_BOOKING_INVOICE_ERROR })
      }
    }
    // getInvoice();
  }, [])

  const handleSave = async (shouldSave, invoice) => {

    if (shouldSave) {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };

        const saveOne = { ...invoice };

        setInvoiceState(saveOne);

        dispatch({ type: REQUEST_CREATE_BOOKING_INVOICE })

        let payment_method = "Unpaid";
        if (saveOne.payment_method === 'Credit Card' && rootState.auth.user.stripe_public_key && rootState.auth.user.stripe_public_key.length)
          payment_method = "Pending"
        if (saveOne.payment_method === 'Online Payment' && rootState.auth.user.stripe_status !== 0)
          payment_method = "Paid"

        const res = await axios.post(
          `/bookings/${booking.id}/invoices`,
          {
            slots: JSON.stringify(saveOne.slots),
            cost_items: JSON.stringify(saveOne.costItems),
            value: saveOne.value,
            payment_method: saveOne.payment_method,
            discount: saveOne.discount,
            customerId: booking.customerId,
            createdAt: saveOne.createdAtAt,
            sub_total: saveOne.amount,
            // tax: saveOne.amount,
            grand_total: saveOne.grand_total,
            status: saveOne.status,
          },
          config
        )

        dispatch({
          type: GET_CREATE_BOOKING_INVOICE_SUCCESS,
          payload: res.data.invoice
        })

        if (saveOne.payment_method === 'Credit Card' && rootState.auth.user.stripe_public_key && rootState.auth.user.stripe_public_key.length) {
          setSelectedChargeData({
            amount: Number(saveOne.amount.toFixed(2)) * 100,
            currency: rootState.settings.companyInfo.currency.length ? rootState.settings.companyInfo.currency : "USD",
            id: res.data.invoice.id,
          })
          setShowCreditCardInfoModal(true);
        } else if (saveOne.payment_method === 'Online Payment' && rootState.auth.user.stripe_status !== 0) {
          const res = await axios.post(
            '/bookings/transferFunds',
            {
              amount: Number(saveOne.amount.toFixed(2)) * 100,
              currency: rootState.settings.companyInfo.currency.length ? rootState.settings.companyInfo.currency : "USD",
              id: res.data.invoice.id,
            }
          ).then(function (res) {
          });
        } 

      } catch (err) {
        dispatch({ type: GET_CREATE_BOOKING_INVOICE_ERROR });
      }
    }
    setshowCreateInvoiceModal(false);
  }

  const handleUpdate = async (invoice, shouldSave) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      dispatch({ type: REQUEST_UPDATE_BOOKING_INVOICE })

      const res = await axios.put(
        `/bookings/${booking.id}/invoices/${invoice.id}`,
        {
          slots: JSON.stringify(invoice.slots),
          cost_items: JSON.stringify(invoice.costItems),
          value: invoice.value,
          payment_method: "Pending",
          discount: invoice.discount,
          customerId: booking.customerId,
          sub_total: invoice.sub_total,
          // tax: saveOne.amount,
          grand_total: invoice.grand_total,
          status: invoice.status,
        },
        config
      )
      dispatch({
        type: UPDATE_BOOKING_INVOICE_SUCCESS,
        payload: res.data.invoice
      })

      if (invoice.payment_method === 'Credit Card' && rootState.auth.user.stripe_public_key && rootState.auth.user.stripe_public_key.length) {
        setSelectedChargeData({
          amount: Number(invoice.sub_total.toFixed(2)) * 100,
          currency: rootState.settings.companyInfo.currency.length ? rootState.settings.companyInfo.currency : "USD",
          id: invoice.id,
        })
        setShowCreditCardInfoModal(true);
      } else if (invoice.payment_method === 'Online Payment') {
        const res = await axios.post(
          '/bookings/transferFunds',
          {
            amount: Number(invoice.sub_total.toFixed(2)) * 100,
            currency: rootState.settings.companyInfo.currency.length ? rootState.settings.companyInfo.currency : "USD",
            id: invoice.id,
          }
        ).then(function (res) {
        });
      }
    } catch (err) {
      dispatch({ type: UPDATE_BOOKING_INVOICE_ERROR });
    }
  }

  const handleDelete = async (invoiceId) => {
    try {
      dispatch({ type: REQUEST_DELETE_BOOKING_INVOICE });

      const res = await axios.delete(`/bookings/${booking.id}/invoices/${invoiceId}`);

      dispatch({
        type: DELETE_BOOKING_INVOICE_SUCCESS,
        payload: invoiceId,
      })
    } catch (err) {
      dispatch({ type: DELETE_BOOKING_INVOICE_ERROR })
    }
  }

  const hideCreditModal = () => {
    setShowCreditCardInfoModal(false)
  }

  return (
    <>
      <SpinnerContainer loading={state.bookings.loadingInvoice.toString()} />
      {state.bookings && state.bookings.invoices && state.bookings.invoices.length > 0 && (
        <Table
          columns="50px 120px auto auto auto 50px 50px"
          columnTitles={["#", "Created", "Amount", "Payment", "Status", "", ""]}
        >
          {state.bookings.invoices.map((invoice, index) => {
            return (
              <React.Fragment key={index}>
                <TableValue>{invoice.number || index + 1}</TableValue>
                <TableValue>{formatEventDate(invoice.created)}</TableValue>
                <TableValue>
                  {formatCurrency(invoice.grand_total || 0, state.bookings.currency)}
                </TableValue>
                <TableValue>{invoice.payment_method || "N/A"}</TableValue>
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
                  onItemSelected={item => {
                    handleDelete(invoice.id)
                  }}
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
        <InvoiceDetail
          invoice={selectedInvoiceCoordinates}
          handleUpdate={(invoice, invoiceId) => {
            handleUpdate(invoice, invoiceId)
          }}
        />
      </Modal>

      <Modal
        isOpen={showCreateInvoiceModal}
        onClose={() => setshowCreateInvoiceModal(false)}
      >
        <NewInvoice
          invoiceNumber={
            state.bookings.invoices && state.bookings.invoices.length + 1
          }
          booking={booking}
          onEndEditing={(invoice, data) => {
            handleSave(invoice, data)
          }}
        />
      </Modal>

      {
        (rootState.auth.user.stripe_public_key && rootState.auth.user.stripe_public_key.length > 0) && (
          <Modal
            isOpen={showCreditCardInfoModal}
            onClose={() => setShowCreditCardInfoModal(false)}
          >
            <ModalContainer>
              <ModalTopSection>
                <ModalTitleAndButtons>
                  <H3>Credit Card Info</H3>
                  <Button
                    primary
                    style={{ marginRight: 10 }}
                    onClick={() => setShowCreditCardInfoModal(false)}
                  >
                    Close
                  </Button>
                </ModalTitleAndButtons>

              </ModalTopSection>

              <ModalBottomSection>
                <StripeApp
                  stripe_pk_key={rootState.auth.user.stripe_public_key}
                  chargeData={selectedChargeData}
                  closeModal={hideCreditModal}
                />
              </ModalBottomSection>
            </ModalContainer>
          </Modal>
        )
      }
    </>
  );
};

export default InvoicesSection;
