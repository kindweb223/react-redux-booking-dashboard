import React, { useEffect, useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

import { AppReducerContext } from "../../../../contexts/AppReducerContext";
import H1 from "../../../typography/H1";
import colors from "../../../style/Colors";
import TopBanner from "./TopBanner";
import P2 from "../../../typography/P2";
import BookingRow from "../../bookingRow";
import { DASHBOARD_UPCOMING_BOOKING_PANEL, NEXT_7_DAYS, NEXT_30_DAYS } from "../../../../constants";
import { isBookingWithDates, startOfUpcomingWeek, endOfUpcomingWeek } from "../../../../utils/dates";
import { checkPropTypes } from "prop-types";

const PanelDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1em;
  background-color: white;
  box-shadow: 0 5px 15px 5px rgba(164, 173, 186, 0.25);
  border-radius: 3px;
  max-height: 70vh;
  overflow: hidden;
`;

const TotalValue = styled(H1)`
  color: ${colors.dark};
  font-size: 3em;
  font-weight: 500;
`;

const BookingsList = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const UpcomingBookingPanel = props => {
  const { state } = useContext(AppReducerContext);
  const [ selectedBookings, setSelectedBookings ] = useState([]);

  useEffect(() => {
    const newFiltered = state.bookings.bookings.filter(
      booking => isBookingWithDates(booking, startOfUpcomingWeek(), endOfUpcomingWeek())
    )
    setSelectedBookings([...newFiltered]);
  }, [
    state.dashboard.upcomingBookingPeriod, 
    state.bookings.bookings
  ])

  const handleClickBooking = booking => {
    props.history.push({
      pathname: '/calendar',
      state: {
        booking: booking
      }
    })
  }

  return (
    <PanelDiv>
      <TopBanner
        title={DASHBOARD_UPCOMING_BOOKING_PANEL} 
        selectedDate={state.dashboard.upcomingBookingPeriod} 
        timePeriods={[NEXT_7_DAYS, NEXT_30_DAYS]}
      />
      <TotalValue>
        {selectedBookings && selectedBookings.length} Bookings
      </TotalValue>
      <BookingsList>
        {selectedBookings && selectedBookings.map(booking => (
          <BookingRow
            key={booking.id}
            booking={booking}
            onClick={() => handleClickBooking(booking)}
          />
        ))}
        {selectedBookings && selectedBookings.length === 0 && (
          <P2 style={{ marginTop: 10 }} color="grey">
            No bookings here. Add a booking in the coming weeks and it will show up here.              
          </P2>
        )}
      </BookingsList>
    </PanelDiv>
  );
};

export default withRouter(UpcomingBookingPanel);