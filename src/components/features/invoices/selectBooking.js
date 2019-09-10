import React, { useContext, useState } from "react";
import {
  ModalBottomSection,
  ModalTitleAndButtons,
  ModalTopSection,
  ModalContainer
} from "../../modals/containers";
import H3 from "../../typography/H3";
import { AppReducerContext } from "../../../contexts/AppReducerContext";
import { css } from "emotion";
import P1 from "../../typography/P1";
import P2 from "../../typography/P2";
import { formatEventDate } from "../../../utils/dateFormatting";
import Button from "../../buttons/Button";
import SearchField from "../../inputs/searchField";

const BookingRow = props => {
  const { onSelectBooking, booking } = props;
  const { title, customer, received } = booking;

  return (
    <div
      className={css`
        background: white;
        padding: 0.5em 1em;
        border-radius: 0.5em;
        display: flex;
        align-items: center;
        justify-content: space-between;

        width: 100%;

        margin-left: auto;
        margin-right: auto;
        margin-bottom: 1em;
      `}
    >
      <div
        className={css`
          margin-right: 1em;
          p {
            margin: 0;
            :first-of-type {
              margin-bottom: 0.05em;
            }
          }

          div:last-child {
            margin-left: auto;
          }
        `}
      >
        <P1 color="dark">{title}</P1>
        <P2 color="grey">{customer.name}</P2>
        <P2 color="light_grey">{formatEventDate(received)}</P2>
      </div>

      <Button
        primary
        onClick={() => {
          onSelectBooking();
        }}
      >
        New Invoice
      </Button>
    </div>
  );
};

const SelectBookingModal = props => {
  const { onSelectBooking } = props;
  const { state } = useContext(AppReducerContext);
  const [searchQuery, setSearchQuery] = useState("");

  const bookings = state.bookings.bookings;
  const filteredBookings = bookings.filter(b =>
    b.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ModalContainer>
      <ModalTopSection>
        <ModalTitleAndButtons>
          <H3 style={{ margin: 0 }}>
            Select a Booking to associate to the invoice
          </H3>
        </ModalTitleAndButtons>
      </ModalTopSection>

      <ModalBottomSection>
        <SearchField
          query={searchQuery}
          placeholder={"Search Bookings"}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ marginBottom: 30 }}
        />

        {filteredBookings.map(b => (
          <BookingRow
            key={b.id}
            booking={b}
            onSelectBooking={() => onSelectBooking(b.id)}
          />
        ))}
      </ModalBottomSection>
    </ModalContainer>
  );
};

export default SelectBookingModal;
