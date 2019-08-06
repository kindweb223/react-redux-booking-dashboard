import React, { useState, useContext } from "react";
import { Redirect } from 'react-router-dom';
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

const CalendarPage = props => {
  const [selectedBookingID, setSelectedBookingID] = useState(null);
  const [showCreateBookingModal, setShowCreateBookingModal] = useState(false);
  const [createBookingModalInfo, setCreateBookingModalInfo] = useState(null);

  const { calendarExpanded } = useContext(CalendarContext);
  const { state, dispatch } = useContext(AppReducerContext);

  const venues = state.settings.venues;
  const events = state.bookings.map(b => bookingToEvents(b, venues)).flat();

  const handleSelectSlot = ({ start, end }) => {
    setShowCreateBookingModal(true);
    setCreateBookingModalInfo({ startDate: start, endDate: end });
  };

  const onSelectEvent = event => {
    setSelectedBookingID(event.bookingID);
  };

  if(!state.auth.isAuthenticated) {
    return <Redirect to='/login' />;
  }
  
  return (
    <>
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
            booking={state.bookings.find(b => b.id === selectedBookingID)}
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
                dispatch({ type: "upsert_booking", booking: booking });
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
