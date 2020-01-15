import React from "react";
import styled from "styled-components";
import colors from "../style/Colors";
import moment from "moment";
import P2 from "../typography/P2";

const BookingRow = props => {
  const { booking, onClick } = props;

  const Container = styled.div`
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 1em;
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
    color: #sss;
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
      <Subtitle strong>{`${booking.eventName}`}</Subtitle>
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
    if (typeof date.getMonth === 'function' && prevMonthYear !== `${date.getMonth()}-${date.getYear()}`) {
      flushBuffer();
      buffer = [];
      prevMonthYear = `${date.getMonth()}-${date.getYear()}`;
    }

    buffer.push(date);
  }

  flushBuffer();

  return res.join(", ");
}

export default BookingRow;
