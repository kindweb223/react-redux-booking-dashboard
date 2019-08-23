import { updatedDate } from "../utils/dates";

/**
 * Translates a Booking into events (possibly more than one,
 * depending on the slots of the booking)
 * @param {Booking} booking
 */
function bookingToEvents(booking, venues) {
  const res = [];
  // const venue = venues.find(v => v.id === booking.venue);

  booking.slots.length && booking.slots.forEach((slot, index) => {
    // const space = venue.spaces.find(space => space.id === booking.space);

    switch (slot.kind) {
      case "multi-day":
        slot.dateRange.forEach((slotDate, dateIndex) => {
          res.push({
            id: `${booking.id}_${index}_${dateIndex}`,
            bookingID: booking.id,
            title: booking.title,
            subtitle: booking.eventName,
            start: updatedDate(slotDate, slot.startHour, slot.startMinute),
            end: updatedDate(slotDate, slot.endHour, slot.endMinute),
            accent: "#4a9454"
          });
        });

        break;

      case "single-day":
        res.push({
          id: `${booking.id}_${index}`,
          bookingID: booking.id,
          title: booking.title,
          subtitle: booking.eventName,
          start: updatedDate(slot.date, slot.startHour, slot.startMinute),
          end: updatedDate(slot.date, slot.endHour, slot.endMinute),
          accent: "#6389ea"
        });

        break;

      default:
        break;
    }
  });

  return res;
}

export { bookingToEvents };
