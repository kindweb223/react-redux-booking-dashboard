import React, { useState, useContext } from "react";
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

  const filteredBookings = state.bookings.filter(
    booking =>
      selectedBookingStateFilter === "All" ||
      booking.status === selectedBookingStateFilter
  );

  function bookingWithID(id) {
    return state.bookings.find(b => b.id === id);
  }

  const [bookingStatesNames, bookingStatesColors] = statusesNameAndColors(
    state
  );

  return (
    <>
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
        >
          Add Booking
        </Button>
      </div>

      {filteredBookings && filteredBookings.length > 0 && (
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
          onEndEditing={booking => {
            if (booking) {
              dispatch({ type: "upsert_booking", booking: booking });
            }
            setShowCreateBookingModal(false);
          }}
        />
      </Modal>
    </>
  );
};

export default BookingsPage;
