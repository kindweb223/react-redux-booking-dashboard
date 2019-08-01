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
import { AppReducerContext } from "../../../../contexts/AppReducerContext";

const DetailsSection = props => {
  const { booking } = props;
  const { state } = useContext(AppReducerContext);

  const customer = state.customers.find(c => c.id === booking.customer);
  const venue = state.settings.venues.find(v => v.id === booking.venue);
  const space = venue.spaces.find(space => space.id === booking.space);

  return (
    <>
      <Grid columns="1fr 1fr">
        <TableItem
          style={{ color: `${space.accentColor} !important` }}
          label={"Venue (Space)"}
          value={`${venue.name} (${space.name})`}
        />
        <TableItem label={"Customer"} value={customer.name} />
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
