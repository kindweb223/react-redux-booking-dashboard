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
  statusesNameAndColors
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
  GET_BOOKINGS_ERROR 
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

  const filteredBookings = state.bookings.bookings.filter(
    booking =>
      selectedBookingStateFilter === "All" ||
      booking.status === selectedBookingStateFilter
  );

  function bookingWithID(id) {
    return state.bookings.bookings.find(b => b.id === id);
  }

  const [bookingStatesNames, bookingStatesColors] = statusesNameAndColors(
    state
  );

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
  }, [])

  const handleClickSave = async (booking) => {
    debugger;
    booking.owner = 1;    //test code

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (booking.id === -1) {
      try {
  
        dispatch({ type: REQUSET_ADD_BOOKING })
        
        const res = await axios.post(
          '/bookings', 
          { 
            eventName: booking.eventName,
            venueId: booking.venue,
            spaceId: booking.space,
            customerId: booking.customer,
            ownerId: booking.owner,
            slots: booking.slots,
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
            venueId: booking.venue,
            spaceId: booking.space,
            customerId: booking.customer,
            ownerId: booking.owner,
            slots: booking.slots,
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
    setShowCreateBookingModal(false);
  }

  return (
    <>
      <SpinnerContainer loading={(state.bookings.loadBooking || state.bookings.loadBookingAction) ? "true" : "false"} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 40
        }}
      > 
        <BigTabbedFilter
          items={bookingStatesNames}
          colors={bookingStatesColors}
          selectedItem={selectedBookingStateFilter}
          onSelect={item => {
            setSelectedBookingStateFilter(item);
          }}
          style={{ marginBottom: 0, marginTop: 0, height: 60 }}
        />        
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

      {/* {filteredBookings && filteredBookings.length > 0 && (
        <Table
          columns="auto auto auto auto auto auto auto auto"
          columnTitles={[
            "Received",
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
            const venue = state.settings.venues.find(
              v => v.id === booking.venue
            );
            const space = venue.spaces.find(
              space => space.id === booking.space
            );

            return (
              <React.Fragment key={booking.id}>
                <TableValue>{formatEventDate(booking.received)}</TableValue>
                <TableValue>{booking.title}</TableValue>
                <TableValue
                  style={{
                    color: `${space.accentColor} !important`,
                    margin: 0
                  }}
                >{`${venue.name} (${space.name})`}</TableValue>
                <TableValue>
                  {state.customers.find(c => c.id === booking.customer).name}
                </TableValue>
                <TableValue>{booking.owner}</TableValue>
                <PickerButton
                  options={bookingStatesNames}
                  colors={bookingStatesColors}
                  selectedOption={booking.status}
                  onOptionSelected={status =>
                    dispatch({
                      type: "update_booking_status",
                      id: booking.id,
                      status: status
                    })
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
                    dispatch({ type: "delete_booking", id: booking.id });
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
      )} */}

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
