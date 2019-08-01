import React, { useContext } from "react";
import styled from "styled-components";
import colors from "../style/colors";
import moment from "moment";
import P2 from "../typography/P2";
import { AppReducerContext } from "../../contexts/AppReducerContext";

const BookingRow = props => {
  const { booking, onClick } = props;

  const { state } = useContext(AppReducerContext);

  const venue = state.settings.venues.find(v => v.id === booking.venue);
  const space = venue.spaces.find(space => space.id === booking.space);

  const Container = styled.div`
    background: white;
    border: 1px solid ${space.accentColor};
    border-radius: 8px;
    margin-bottom: 1em;
    overflow: hidden;
    :first-child {
      margin-top: 1em;
    }
    cursor: pointer;
  `;

  const Title = styled.p`
    font-size: 1.2em;
    font-weight: 500;
    color: ${colors.dark};
    padding: 0.8rem 1.2rem 0.2rem;
    margin: 0;
  `;

  const Subtitle = styled(P2)`
    color: ${space.accentColor};
    padding: 0 1.2rem 0.7rem;
    margin: 0;
  `;

  const Footer = styled.div`
    height: 2.5em;
    background: ${colors.lighter};
    display: flex;
    direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.2rem;
    p {
      margin: 0;
    }
  `;

  return (
    <Container onClick={onClick}>
      <Title>{booking.title}</Title>
      <Subtitle strong>{`${venue.name} (${space.name})`}</Subtitle>
      <Footer>
        <P2 color="grey">{formatSlotsDatesForFooter(booking.slots)}</P2>
      </Footer>
    </Container>
  );
};

/**
 * Formats the slots dates and returns a short string describing the datates of the slot (e.g. "16, 18-21 June")
 * @param {*} slots the slots of a booking
 */
function formatSlotsDatesForFooter(slots) {
  const dates = slots
    .map(slot => {
      switch (slot.kind) {
        case "single-day":
          return slot.date;
        case "multi-day":
          return slot.dateRange;
        default:
          throw Error();
      }
    })
    .flat();

  const sortedDates = dates.sort((a, b) => (a > b ? 1 : -1));

  let res = [];
  let buffer = [];
  let prevMonthYear = null;

  function flushBuffer() {
    if (buffer.length > 0) {
      const formattedDates = buffer.map(date => moment(date).format("D"));
      res.push(
        formattedDates.join("-") + " " + moment(buffer[0]).format("MMM")
      );
    }
  }

  for (let date of sortedDates) {
    if (prevMonthYear !== `${date.getMonth()}-${date.getYear()}`) {
      flushBuffer();
      buffer = [];
      prevMonthYear = `${date.getMonth()}-${date.getYear()}`;
    }

    buffer.push(date);
  }

  flushBuffer();

  return res.join(", ");
}

/**
 * Formats the time in some slots for display in a short string.
 * @param {*} slots the slots of a booking
 */
// function formatSlotsTimes(slots) {
//   const timesSet = new Set();
//   slots.forEach(slot => {
//     // we use this day just to format the hour with moment
//     const startDate = new Date(1992, 11, 29, slot.startHour, slot.startMinute);
//     const endDate = new Date(1992, 11, 29, slot.endHour, slot.endMinute);
//     timesSet.add(formatEventStartEndTime(startDate, endDate));
//   });

//   if (timesSet.size === 1) {
//     return timesSet.values().next().value;
//   } else {
//     return "multiple";
//   }
// }

export default BookingRow;
