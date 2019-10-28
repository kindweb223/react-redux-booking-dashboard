import React, {useState, useContext, useEffect} from "react";
import Grid from "../components/layout/Grid";
import constants from "../components/layout/constants";
import Calendar from "../components/features/calendar";
import { bookingToEvents } from "../models/bookingToEvents";
import TabbedBookingsList from "../components/features/tabbedBookingsList";
import BookingDetail from "../components/features/bookingDetail/bookingDetail";
import Modal from "../components/modals/modal";
import CalendarContext from "../contexts/CalendarContext";
import { AppReducerContext } from "../contexts/AppReducerContext";
import BookingDetailEdit from "../components/features/bookingDetail/bookingDetailEdit";
import { createEmptyBooking } from "../models/bookings";
import {
  REQUSET_ADD_BOOKING,
  GET_ADD_BOOKING_SUCCESS,
  GET_ADD_BOOKING_ERROR,
  GET_UPDATE_BOOKING_SUCCESS,
  GET_UPDATE_BOOKIG_ERROR,
  REQUEST_UPDATE_BOOKING,
  GET_BOOKING_BOOKINGSATTUS_ERROR,
  GET_BOOKING_BOOKINGSTATUS_SUCCESS, GET_BOOKING_SETTINGS_ERROR, GET_BOOKING_SETTINGS_SUCCESS, GET_BOOKINGS_ERROR,
  GET_BOOKINGS_SUCCESS, GET_CUSTOMERS_ERROR, GET_CUSTOMERS_SUCCESS, GET_VENUE_ERROR, GET_VENUE_SUCCESS,
  REQUEST_GET_BOOKING_BOOKINGSTATUS,
  REQUEST_GET_BOOKINGS, REQUEST_GET_CUSTOMERS,
  REQUEST_GET_VENUE,
  REUQEST_GET_BOOKING_SETTINGS,
  CLEAR_BOOKING_DATA,
  GET_ADD_CUSTOMER_SUCCESS,
} from "../reducers/actionType";

import {
  CUSTOMER_OPTION_CREATE_USER,
  // CUSTOMER_OPTION_CASUAL_USER,
} from '../constants';

import axios from "axios/index";
import SpinnerContainer from "../components/layout/Spinner";

const CalendarPage = props => {
  const [selectedBookingID, setSelectedBookingID] = useState(null);
  const [showCreateBookingModal, setShowCreateBookingModal] = useState(false);
  const [createBookingModalInfo, setCreateBookingModalInfo] = useState(null);

  const { calendarExpanded } = useContext(CalendarContext);
  const { state, dispatch } = useContext(AppReducerContext);
  const venues = state.settings.venues;
  let events = [];

  useEffect(() => {

    const getBookings = async () => {
      try {
        dispatch({ type: REQUEST_GET_BOOKINGS });

        const res = await axios.get('/bookings');

        dispatch({
          type: GET_BOOKINGS_SUCCESS,
          payload: res.data.bookings
        })
      } catch (err) {
        dispatch({ type: GET_BOOKINGS_ERROR });
      }
    }

    getBookings();

    const getCustomers = async () => {
      try {
        dispatch({ type: REQUEST_GET_CUSTOMERS });

        const res = await axios.get('/customers');

        dispatch({
          type: GET_CUSTOMERS_SUCCESS,
          payload: res.data.customers
        })
      } catch (err) {
        dispatch({ type: GET_CUSTOMERS_ERROR });
      }
    }
    if (!(state.customers.customers && state.customers.customers.length))
    getCustomers();

    const getVenue = async () => {
      try {
        dispatch({ type: REQUEST_GET_VENUE });

        const res = await axios.get('/venues');
        const venues = res.data.venues;
        venues.map(item => {
          if (!item.spaces) {
            item.spaces = [];
          }
          return item;
        })

        dispatch({
          type: GET_VENUE_SUCCESS,
          payload: venues
        })

      } catch (err) {
        console.log("Get Venus Setting failed.")
        dispatch({ type: GET_VENUE_ERROR });
      }
    }

    if (!(venues && venues.length > 0))
    getVenue();

    const getCompany = async () => {
      try {
        dispatch({ type: REUQEST_GET_BOOKING_SETTINGS});

        const res = await axios.get('/company');
        dispatch({
          type: GET_BOOKING_SETTINGS_SUCCESS,
          payload: {...res.data.company, loadBooking: true},
        })
      } catch (err) {
        dispatch({ type: GET_BOOKING_SETTINGS_ERROR });
      }
    }

    if (!(state.bookings && state.bookings.currency))
    getCompany();

    const getBookingStatus = async () => {

      try {
        dispatch({ type: REQUEST_GET_BOOKING_BOOKINGSTATUS });

        const res = await axios.get('/statuses');

        dispatch({
          type: GET_BOOKING_BOOKINGSTATUS_SUCCESS,
          payload: res.data.statuses
        });
      } catch(err) {
        dispatch({ type: GET_BOOKING_BOOKINGSATTUS_ERROR });
      }

    }
    if(!(state.bookings.bookingStatus && state.bookings.bookingStatus.length > 0))
    getBookingStatus();

  }, [])

  useEffect(() => {
    if (state.bookings && state.bookings.bookings && state.bookings.bookings.length > 0)
      events = state.bookings.bookings && state.bookings.bookings.map(b => bookingToEvents(b, venues)).flat();
  }, [state.bookings.bookings])

  const handleClickSave = async (booking) => {
    setShowCreateBookingModal(false);

    if (booking === null) return;
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (booking.id === -1) {
      try {

        dispatch({ type: REQUSET_ADD_BOOKING })
        const filteredStatus = state.bookings.bookingStatus.filter(item => item.name === "Enquiry");

        let resCustomer = {};
        let customerId = booking.customerId;

        if (booking.customerId === CUSTOMER_OPTION_CREATE_USER) {
          resCustomer = await axios.post(
            '/customers', 
            JSON.stringify({
              name: booking.customerData.name.value,
              phone: booking.customerData.phone.value,
              address: booking.customerData.address.value,
              email: booking.customerData.email.value,
              note: booking.customerData.note.value,
              vatNumber: booking.customerData.vatNumber.value,
            }), 
            config
          )
          dispatch({
            type: GET_ADD_CUSTOMER_SUCCESS,
            payload: resCustomer.data.customer,
          })
          customerId = resCustomer.data.customer.id;
        }

        const res = await axios.post(
          '/bookings',
          {
            eventName: booking.eventName,
            venueId: booking.venueId,
            spaceId: booking.spaceId,
            customerId: customerId,
            ownerId: booking.ownerId,
            slots: JSON.stringify(booking.slots),
            statusId: filteredStatus[0].id,
          },
          config
        );

        dispatch({
          type: GET_ADD_BOOKING_SUCCESS,
          payload: res.data.booking
        })

      } catch (err) {
        dispatch({ type: GET_ADD_BOOKING_ERROR })
      }
    } else {
      try {
        dispatch({ type: REQUEST_UPDATE_BOOKING })

        let resCustomer = {};
        let customerId = booking.customerId;

        if (booking.customerId === CUSTOMER_OPTION_CREATE_USER) {
          resCustomer = await axios.post(
            '/customers', 
            JSON.stringify({
              name: booking.customerData.name.value,
              phone: booking.customerData.phone.value,
              address: booking.customerData.address.value,
              email: booking.customerData.email.value,
              note: booking.customerData.note.value,
              vatNumber: booking.customerData.vatNumber.value,
            }), 
            config
          )
          dispatch({
            type: GET_ADD_CUSTOMER_SUCCESS,
            payload: resCustomer.data.customer,
          })
          customerId = resCustomer.data.customer.id;
        }

        const res = await axios.put(
          `/bookings/${booking.id}`,
          {
            eventName: booking.eventName,
            venueId: booking.venueId,
            spaceId: booking.spaceId,
            customerId: customerId,
            ownerId: booking.ownerId,
            statusId: booking.statusId,
            slots: JSON.stringify(booking.slots),
          },
          config
        );

        dispatch({
          type: GET_UPDATE_BOOKING_SUCCESS,
          payload: res.data.booking
        })
      } catch (err) {
        dispatch({ type: GET_UPDATE_BOOKIG_ERROR});
      }
    }
  }

  const handleSelectSlot = ({ start, end }) => {
    setShowCreateBookingModal(true);
    setCreateBookingModalInfo({ startDate: start, endDate: end });
  };

  const onSelectEvent = event => {
    dispatch({
      type: CLEAR_BOOKING_DATA,
      payload: ""
    })
    setSelectedBookingID(event.bookingID);
  };

  return (
    <>
      <SpinnerContainer loading={ (events && events.length <= 0) && (state.bookings.loadBooking || state.bookings.loadBookingAction) ? "true" : "false"} />
      <Grid
        fullheight
        columns={`${!calendarExpanded && constants.leftPanelWidth} 1fr`}
        style={{ height: "100%" }}
      >
        {!calendarExpanded && (
          <div style={{ overflow: "scroll" }}>
            <TabbedBookingsList
              onSelect={booking => setSelectedBookingID(booking.id)}
            />
          </div>
        )}

        <Modal
          isOpen={selectedBookingID !== null}
          onClose={() => setSelectedBookingID(null)}
        >
          <BookingDetail
            booking={state.bookings.bookings && state.bookings.bookings.find(b => b.id === selectedBookingID)}
          />
        </Modal>
        <Modal
          isOpen={showCreateBookingModal}
          onClose={() => setShowCreateBookingModal(false)}
        >
          <BookingDetailEdit
            booking={createEmptyBooking()}
            onEndEditing={booking => {
              if (booking) {
                handleClickSave(booking)
                // dispatch({ type: "upsert_booking", booking: booking });
              }
              setShowCreateBookingModal(false);
            }}
            {...createBookingModalInfo}
          />
        </Modal>
        <Calendar
          selectable
          events={events}
          onSelectEvent={onSelectEvent}
          onSelectSlot={handleSelectSlot}
        />
      </Grid>
    </>
  );
};

export default CalendarPage;
