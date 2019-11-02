import moment from "moment";

function updatedDate(date, newHour, newMinute) {
  const newDate = new Date(date);
  newDate.setHours(newHour);
  newDate.setMinutes(newMinute);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}

function addDays(date, daysDelta) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + daysDelta);
  return newDate;
}

function startOfWeek() {
  return moment()
    .startOf("week")
    .toDate();
}

function endOfWeek() {
  return moment()
    .endOf("week")
    .toDate();
}

function startOfUpcomingWeek() {
  return moment()
    .add(1, 'weeks')
    .startOf("isoWeek")
    .toDate();
}

function endOfUpcomingWeek() {
  return moment()
    .add(2, 'weeks')
    .endOf("isoWeek")
    .toDate();
}

function isBookingWithDates(booking, startDate, endDate) {
  for (const slot of booking.slots) {
    switch (slot.kind) {
      case "multi-day":
        for (const date of slot.dateRange) {
          const dateValue = (new Date(date)).getTime();
          if (
            // typeof date.getTime === 'function' && startDate.getTime() < date.getTime() &&
            // date.getTime() < endDate.getTime()
            dateValue !== 0 && startDate.getTime() < dateValue && dateValue < endDate.getTime()
          ) {
            return true;
          }
        }

        break;

      case "single-day":
        const dateValue = (new Date(slot.date)).getTime();
        if (
          // typeof slot.date.getTime === 'function' && startDate.getTime() < slot.date.getTime() &&
          // slot.date.getTime() < endDate.getTime()
          dateValue !== 0 && startDate.getTime() < dateValue && dateValue < endDate.getTime()
        ) {
          return true;
        }
        break;

      default:
        throw new Error();
    }
  }
  return false;
}

export { 
  updatedDate, 
  startOfWeek, 
  endOfWeek, 
  startOfUpcomingWeek,
  endOfUpcomingWeek,
  isBookingWithDates, 
  addDays };
