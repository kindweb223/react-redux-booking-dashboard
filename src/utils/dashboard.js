import moment from "moment"
import { updatedDate } from './dates'

import {
  LAST_7_DAYS, LAST_30_DAYS, NEXT_7_DAYS, NEXT_30_DAYS
} from '../constants'

const getPanelDateRange = dateRange => {
  const current = moment()
  const arrDate = []  
  if (dateRange === LAST_7_DAYS) {
    let n = 8
    while (n>0) {
      arrDate.push(current.format('ddd D'))
      current.subtract(1, 'day')
      n--
    }
    arrDate.reverse();
  } else if (dateRange === LAST_30_DAYS) {
    let n = 31
    while (n>0) {
      arrDate.push(current.format('ddd D'))
      current.subtract(1, 'day')
      n--
    }
    arrDate.reverse();
  } else if (dateRange === NEXT_7_DAYS) {    
    let n = 0;
    while (n<8) {
      arrDate.push(current.format('ddd D'))
      current.add(1, 'day')
      n++
    }
  } else if (dateRange === NEXT_30_DAYS) {
    let n=0;
    while (n<31) {
      arrDate.push(current.format('ddd D'))
      current.add(1, 'day')
      n++
    }
  }
  return arrDate;  
}

const getBookingWithDateRange = (bookings, period) => { 
  let filteredOne = []
  let maxBooking = {id: -1, name: "", count: 0}
  const current = new moment();

  let startDate, endDate;
  if (period === LAST_7_DAYS) {
    endDate = current.endOf('day').valueOf()
    startDate = current.subtract(8, 'day').startOf('day').valueOf()            
  } else if (period === LAST_30_DAYS) {
    endDate = current.endOf('day').valueOf()
    startDate = current.subtract(31, 'day').startOf('day').valueOf()            
  } else if (period === NEXT_7_DAYS ) {
    startDate = current.startOf('day').valueOf()
    endDate = current.add(8, 'day').endOf('day').valueOf()
  } else if (period === NEXT_30_DAYS) {
    startDate = current.startOf('day').valueOf()
    endDate = current.add(31, 'day').endOf('day').valueOf()
  }    

  bookings.map(item => {
    let maxCountOne = 0;
    if (item.slots && item.slots.length > 0) {
      item.slots.map(slot => {
        if (slot.kind === 'single-day') {
          if (
            startDate <= updatedDate(slot.date, slot.startHour, slot.startMinute).valueOf() &&
            updatedDate(slot.date, slot.endHour, slot.endMinute).valueOf() <= endDate
          ) {
            maxCountOne ++
            filteredOne.push({
              startDate: updatedDate(slot.date, slot.startHour, slot.startMinute).valueOf(),
              endDate: updatedDate(slot.date, slot.endHour, slot.endMinute).valueOf()
            })
          }
        } else if (slot.kind === 'multi-day') {
          if (
            startDate <= updatedDate(slot.dateRange[0], slot.startHour, slot.startMinute).valueOf() && 
            updatedDate(slot.dateRange[1], slot.endHour, slot.endMinute).valueOf() <= endDate
          ) 
          {              
            maxCountOne ++
            filteredOne.push({
              startDate: updatedDate(slot.dateRange[0], slot.startHour, slot.startMinute).valueOf(),
              endDate: updatedDate(slot.dateRange[1], slot.endHour, slot.endMinute).valueOf()
            })
          }            
        }
      })
    }

    if (maxBooking.count < maxCountOne) {
      maxBooking.count  = maxCountOne
      maxBooking.id     = item.id
      maxBooking.name   = item.eventName
    }
  })

  let startTempDate = startDate
  let bookingArray = {};
  while(startTempDate <=  endDate) { 
    bookingArray[startTempDate] = 0
    startTempDate = moment(startTempDate).add(1, 'day').startOf().valueOf()      
  }

  filteredOne.forEach(item => {
    let bookingStartDate  = moment(item.startDate).startOf('day')
    let bookingEndDate    = moment(item.endDate).startOf('day')

    while(bookingStartDate.valueOf() <= bookingEndDate.valueOf()) {
      bookingArray[bookingStartDate.valueOf()] += 1;
      bookingStartDate.add(1, 'day');
    }
  })

  return bookingArray  
}

export { 
  getPanelDateRange,
  getBookingWithDateRange,
}