import React, { useState, useContext } from "react";
import styled from "styled-components";
import colors from "../style/colors";
import P1 from "../typography/P1";
import BookingRow from "./bookingRow";
import { isBookingWithDates, startOfWeek, endOfWeek } from "../../utils/dates";
import P2 from "../typography/P2";
import { AppReducerContext } from "../../contexts/AppReducerContext";

const TabbedBookingsList = props => {
  const { onSelect } = props;
  const [selectedTab, setSelectedTab] = useState("week");
  const { state } = useContext(AppReducerContext);

  const bookings = (() => {
    if (selectedTab === "week") {
      return state.bookings.bookings && state.bookings.bookings.filter(booking =>
        isBookingWithDates(booking, startOfWeek(), endOfWeek())
      );
    } else if (selectedTab === "upcoming") {
      return state.bookings.bookings.filter(
        booking => !isBookingWithDates(booking, startOfWeek(), endOfWeek())
      );
    } else {
      throw new Error();
    }
  })();

  const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
  `;

  const Header = styled.div`
    border-bottom: 1px solid ${colors.light};
    position: sticky;
    top: 0;
    background: ${colors.lightest};
    p {
      display: inline-block;
      margin: 0 1em 0 0;
      cursor: pointer;
      padding: 0 0 0.5em;
    }
    .selected {
      color: ${colors.accent_pink};
      font-weight: 500;
      border-bottom: 2px solid ${colors.accent_pink};
    }
  `;

  const BookingsList = styled.div``;

  return (
    <Wrapper>
      <Header>
        <P1
          className={selectedTab === "week" && "selected"}
          onClick={() => setSelectedTab("week")}
        >
          This Week
        </P1>{" "}
        <P1
          className={selectedTab === "upcoming" && "selected"}
          onClick={() => setSelectedTab("upcoming")}
        >
          Upcoming
        </P1>
      </Header>
      <BookingsList>
        {state.bookings.bookings && state.bookings.bookings.map(booking => (
          <BookingRow
            key={booking.id}
            booking={booking}
            onClick={() => onSelect(booking)}
          />
        ))}
        {state.bookings.bookings && state.bookings.bookings.length === 0 && (
          <P2 style={{ marginTop: 10 }} color="grey">
            {selectedTab === "upcoming"
              ? "No bookings here. Add a booking in the coming weeks and it will show up here."
              : "No bookings here. Try adding one from the Bookings section."}
          </P2>
        )}
      </BookingsList>
    </Wrapper>
  );
};

export default TabbedBookingsList;
