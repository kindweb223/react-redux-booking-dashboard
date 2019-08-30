import React, { useState, useContext, useEffect } from "react";
import axios from 'axios';
import Modal from "../components/modals/modal";
import BookingDetail from "../components/features/bookingDetail/bookingDetail";
import { createEmptyBooking } from "../models/bookings";
import { Table, TableValue } from "../components/tables/tables";
import { formatEventDate } from "../utils/dateFormatting";
import PickerButton from "../components/buttons/PickerButton";
import BigTabbedFilter from "../components/features/BigTabbedFilter";
import OutlinedButton from "../components/buttons/OutlinedButton";
import Button from "../components/buttons/Button";
import AddGlyph from "../images/Glyphs/AddGlyph";
import SvgButton from "../components/buttons/SvgButton";
import colors from "../components/style/colors";
import viewGlyph from "../images/Glyphs/view.svg";
import BookingDetailEdit from "../components/features/bookingDetail/bookingDetailEdit";
import P2 from "../components/typography/P2";
import {
  AppReducerContext,
  getStatuColor,
} from "../contexts/AppReducerContext";
import DropdownMenu from "../components/buttons/DropdownMenu";
import SpinnerContainer from "../components/layout/Spinner";

import {
  REQUSET_ADD_BOOKING,
  GET_ADD_BOOKING_SUCCESS,
  GET_ADD_BOOKING_ERROR,
  REQUEST_UPDATE_BOOKING,
  GET_UPDATE_BOOKING_SUCCESS,
  GET_UPDATE_BOOKIG_ERROR,
  REQUEST_GET_BOOKINGS,
  GET_BOOKINGS_SUCCESS,
  GET_BOOKINGS_ERROR,
  REQUEST_DELETE_BOOKING,
  GET_DELETE_BOOKING_SUCCESS,
  GET_DELETE_BOOKING_ERROR,
  REQUEST_GET_BOOKING_BOOKINGSTATUS,
  GET_BOOKING_BOOKINGSTATUS_SUCCESS,
  GET_BOOKING_BOOKINGSATTUS_ERROR,
  REUQEST_GET_BOOKING_SETTINGS,
  GET_BOOKING_SETTINGS_SUCCESS,
  GET_BOOKING_SETTINGS_ERROR,
} from "../reducers/actionType";

const BookingsPage = props => {
  const { state, dispatch } = useContext(AppReducerContext);

  const [showCreateBookingModal, setShowCreateBookingModal] = useState(false);
  const [selectedBookingStateFilter, setSelectedBookingStateFilter] = useState(
    "All"
  );
  const [selectedBookingID, setSelectedBookingID] = useState(
    null
    // "99af5d47-3837-4623-be55-f85c0b511c0f"
  );

  const filteredBookings = (state.bookings.bookings && state.bookings.bookings.length > 0 ) ?
    state.bookings.bookings.filter(
      booking =>
        selectedBookingStateFilter === "All" ||
        booking.status.name === selectedBookingStateFilter
    ) : [];

  function bookingWithID(id) {
    return state.bookings.bookings && state.bookings.bookings.find(b => b.id === id);
  }

  useEffect(() => {

    const getCompany = async () => {
      try {
        dispatch({ type: REUQEST_GET_BOOKING_SETTINGS});

        const res = await axios.get('/company');

        dispatch({
          type: GET_BOOKING_SETTINGS_SUCCESS,
          payload: res.data.company,
        })
      } catch (err) {
        dispatch({ type: GET_BOOKING_SETTINGS_ERROR });
      }
    }
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
    getBookingStatus();

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
  }, [])

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

        const res = await axios.post(
          '/bookings',
          {
            eventName: booking.eventName,
            venueId: booking.venueId,
            spaceId: booking.spaceId,
            customerId: booking.customerId,
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

        const res = await axios.put(
          `/bookings/${booking.id}`,
          {
            eventName: booking.eventName,
            venueId: booking.venueId,
            spaceId: booking.spaceId,
            customerId: booking.customerId,
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

    // if (booking) {
    //   dispatch({ type: "upsert_booking", booking: booking });
    // }
  }



  const handleClickDelete = async (id) => {

    dispatch({ type: REQUEST_DELETE_BOOKING })

    try {

      const res = await axios.delete(`/bookings/${id}`);

      dispatch({
        type: GET_DELETE_BOOKING_SUCCESS,
        payload: id
      })
    } catch (err) {
      dispatch({ type: GET_DELETE_BOOKING_ERROR })
    }

  }

  const handleChangeStatus = async (id, status) => {

    try {
      dispatch({ type: REQUEST_UPDATE_BOOKING });

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const filteredBooking = state.bookings.bookings.filter(item => item.id === id);
      const filteredBookingsStatus = state.bookings.bookingStatus.filter(item => item.name === status);
      const updateBookingData = {
        eventName: filteredBooking[0].eventName,
        venueId: filteredBooking[0].venueId,
        spaceId: filteredBooking[0].spaceId,
        statusId: filteredBookingsStatus[0].id,
        customerId: filteredBooking[0].customerId,
        ownerId: filteredBooking[0].ownerId,
        slots: JSON.stringify(filteredBooking[0].slots),
      }

      const res = await axios.put(`/bookings/${id}`, updateBookingData, config);

      dispatch({
        type: GET_UPDATE_BOOKING_SUCCESS,
        payload: res.data.booking
      })

    } catch(err) {
      dispatch({ type: GET_UPDATE_BOOKIG_ERROR })
    }
    // dispatch({
    //   type: "update_booking_status",
    //   id: booking.id,
    //   status: status
    // })
  }
  return (
    <>
      <SpinnerContainer loading={ (filteredBookings && filteredBookings.length <= 0) &&
      (state.bookings.loadBooking || state.bookings.loadBookingAction) ? "true" : "false"} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 40
        }}
      >
        {state.bookings.bookingStatus && state.bookings.bookingStatus.length > 0 &&
          <BigTabbedFilter
            items={state.bookings.bookingStatus.map(item => item.name)}
            colors={state.bookings.bookingStatus.map(item => getStatuColor(item.name))}
            selectedItem={selectedBookingStateFilter}
            onSelect={item => {
              setSelectedBookingStateFilter(item);
            }}
            style={{ marginBottom: 0, marginTop: 0, height: 60 }}
        />
        }

        <Button
          primary
          onClick={() => setShowCreateBookingModal(!showCreateBookingModal)}
          iconComponent={() => <AddGlyph fill={colors.white} />}
          style={{ marginLeft: "2em" }}
          disabled={(state.bookings.loadBooking || state.bookings.loadBookingAction)}
        >
          Add Booking
        </Button>
      </div>

      {filteredBookings && filteredBookings.length > 0 && (
        <Table
          columns="auto auto auto auto auto auto auto"
          columnTitles={[
            // "Received",
            "Title",
            "Venue (Space)",
            "Customer",
            "Owner",
            "Status",
            "",
            ""
          ]}
        >
          {filteredBookings.map(booking => {
            return (
              <React.Fragment key={booking.id}>
                {/* <TableValue>{formatEventDate(booking.received)}</TableValue> */}
                <TableValue>{booking.eventName}</TableValue>
                <TableValue
                  style={{
                    color: `${getStatuColor(booking.status.name)} !important`,
                    margin: 0
                  }}
                >
                  {`${booking.venue.name} (${booking.space.name})`}
                </TableValue>
                <TableValue>
                  {booking.customer.name}
                </TableValue>
                <TableValue>{booking.owner.firstName + " " + booking.owner.lastName}</TableValue>
                <PickerButton
                  options={state.bookings.bookingStatus.map(item => item.name)}
                  colors={state.bookings.bookingStatus.map(item => getStatuColor(item.name))}
                  selectedOption={booking.status.name}
                  onOptionSelected={status => {handleChangeStatus(booking.id, status)}
                  }
                />
                <SvgButton
                  width={24}
                  height={24}
                  svg={viewGlyph}
                  onClick={() => setSelectedBookingID(booking.id)}
                />
                <DropdownMenu
                  items={["Archive", "Delete"]}
                  colors={[colors.grey, "#D13636"]}
                  onItemSelected={item => {
                    // dispatch({ type: "delete_booking", id: booking.id });
                    handleClickDelete(booking.id)
                  }}
                />
              </React.Fragment>
            );
          })}
        </Table>
      )}

      {filteredBookings.length === 0 && (
        <>
          <P2 color="grey" center>
            No bookings matching your filter.
          </P2>
          <P2
            center
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => setSelectedBookingStateFilter("All")}
          >
            Show All
          </P2>
        </>
      )}

      <div style={{ display: "flex", alignItems: "center" }}>
        <OutlinedButton style={{ margin: "20px auto" }}>
          Show Archived
        </OutlinedButton>
      </div>

      <Modal
        isOpen={selectedBookingID !== null}
        onClose={() => setSelectedBookingID(null)}
      >
        <BookingDetail booking={bookingWithID(selectedBookingID)} />
      </Modal>

      <Modal
        isOpen={showCreateBookingModal}
        onClose={() => setShowCreateBookingModal(false)}
      >
        <BookingDetailEdit
          booking={createEmptyBooking()}
          onEndEditing={booking => {handleClickSave(booking)}}
        />
      </Modal>
    </>
  );
};

export default BookingsPage;
