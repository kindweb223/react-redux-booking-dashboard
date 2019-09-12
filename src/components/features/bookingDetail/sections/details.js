import React, { useContext } from "react";
import Grid from "../../../layout/Grid";
import {
  TableItem,
  TableSectionHeader,
  Table,
  TableValue
} from "../../../tables/tables";
import {
  formatEventDate,
  formatSlotStartEndTime
} from "../../../../utils/dateFormatting";
import { AppReducerContext, getStatuColor } from "../../../../contexts/AppReducerContext";

const DetailsSection = props => {
  const { booking } = props;
  const { state } = useContext(AppReducerContext);

  const getBookingStatusColor = (selectedBooking) => {
    if (selectedBooking.status && selectedBooking.status.name)
      return getStatuColor(selectedBooking.status.name);
    else return getStatuColor("");
  }

  const getBookingVenueAndSpaceName = (selectedBooking) => {
    const venueName = (selectedBooking.venue && selectedBooking.venue.name) ? selectedBooking.venue.name : "";    
    const spaceName = (selectedBooking.space && selectedBooking.space.name) ? selectedBooking.space.name : "";
    return (venueName + "(" + spaceName + ")");
  }

  return (
    <>
      <Grid columns="1fr 1fr">
        <TableItem
          style={{ color: `${getBookingStatusColor(booking)}} !important` }}
          label={"Venue (Space)"}
          value={getBookingVenueAndSpaceName(booking)}
        />
        <TableItem label={"Customer"} value={ (booking.customer && booking.customer.name) ? booking.customer.name : ""} />
      </Grid>
      <TableSectionHeader title={"Booking Slots"} />
      <Table columns="20% auto" columnTitles={["Date", "Time"]}>
        {booking.slots
          .map(slot => {
            switch (slot.kind) {
              case "multi-day":
                return slot.dateRange.map(date => (
                  <React.Fragment key={booking.id + date.toString()}>
                    <TableValue>{formatEventDate(date)}</TableValue>
                    <TableValue>
                      {formatSlotStartEndTime(date, slot)}
                    </TableValue>
                  </React.Fragment>
                ));
              case "single-day":
                return (
                  <React.Fragment key={booking.id + slot.date.toString()}>
                    <TableValue>{formatEventDate(slot.date)}</TableValue>
                    <TableValue>
                      {formatSlotStartEndTime(slot.date, slot)}
                    </TableValue>
                  </React.Fragment>
                );
              default:
                throw new Error();
            }
          })
          .flat()}
      </Table>
    </>
  );
};

export default DetailsSection;
