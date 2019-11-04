import { updatedDate } from "../utils/dates";

/**
 * Translates a Booking into events (possibly more than one,
 * depending on the slots of the booking)
 * @param {Booking} booking
 */
function bookingToEvents(booking, bookignColors) {
  const res = [];
  // const venue = venues.find(v => v.id === booking.venue);

  booking.slots.length && booking.slots.forEach((slot, index) => {
    // const space = venue.spaces.find(space => space.id === booking.space);
    let filteredColor = getBookingColor(booking, bookignColors);
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
            accent: filteredColor.length > 0 ? filteredColor : "#4a9454"
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
          accent: filteredColor.length > 0 ? filteredColor : "#6389ea"          
        });

        break;

      default:
        break;
    }
  });

  return res;
}

function getBookingColor(booking, bookignColors) {
  let color = '';
  let isMatched = false;
  if (bookignColors && bookignColors.length > 0 && Object.keys(booking).length > 0) {
    debugger;
    bookignColors.forEach(item => {
      item.content.forEach(itemOne => {
        let isOneAddContion = false;
        itemOne.map(itemTwo => {          
          if (itemTwo.condition_key === 'title' && itemTwo.condition_value.length > 0) {
            if (itemTwo.condition_type === 'contains') {
              if (booking.eventName.toLowerCase().indexOf(itemTwo.condition_value.toLowerCase()) >= 0)
                isOneAddContion = true;
            } else if (itemTwo.condition_type === 'not_contains') {
              if (booking.eventName.toLowerCase().indexOf(itemTwo.condition_value.toLowerCase()) < 0)
                isOneAddContion = true;
            }
          } else if (itemTwo.condition_key === 'payment_status') {
            if (itemTwo.condition_type === 'equal') {
              if (booking.status.name.toLowerCase() === itemTwo.condition_value.toLowerCase())
                isOneAddContion = true;              
            } else if(itemTwo.condition_type === 'not_equal') {
              if (booking.status.name.toLowerCase() !== itemTwo.condition_value.toLowerCase())
                isOneAddContion = true;
            }
          }
        })
        if (isOneAddContion) color = item.color;
      })
    })    
  }
  
  return color;
}

export { bookingToEvents };
