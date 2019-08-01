import moment from "moment";
import { updatedDate } from "./dates";

function formatEventStartEndTime(start, end) {
  let startTime = moment(start).format("LT");
  let endTime = moment(end).format("LT");

  if (startTime.indexOf("AM") > -1 && endTime.indexOf("AM") > -1) {
    startTime = startTime.replace(" AM", "");
  }

  if (startTime.indexOf("PM") > -1 && endTime.indexOf("PM") > -1) {
    startTime = startTime.replace(" PM", "");
  }

  const res = `${startTime} - ${endTime}`;
  return res.toLowerCase();
}

function formatEventDate(date) {
  // June 13, 2019
  return moment(date).format("MMMM D, YYYY");
}

function formatSlotStartEndTime(date, slot) {
  const startDate = updatedDate(date, slot.startHour, slot.startMinute);
  const endDate = updatedDate(date, slot.endHour, slot.endMinute);
  return formatEventStartEndTime(startDate, endDate);
}

export { formatEventStartEndTime, formatEventDate, formatSlotStartEndTime };
