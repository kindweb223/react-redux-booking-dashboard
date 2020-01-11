import React ,{ useEffect, useState, useContext } from 'react'
import styled from "styled-components"

import axios from 'axios'
import moment from 'moment'
import { Line } from 'react-chartjs-2';

import { AppReducerContext } from '../contexts/AppReducerContext'

import { updatedDate } from "../utils/dates";

import colors from "../components/style/colors"
import Grid from '../components/layout/Grid'
import H1 from '../components/typography/H1'
import H3 from '../components/typography/H3'
import P2 from '../components/typography/P2'

import DashboardPanel from '../components/features/dashboard/panel/dashboardPanel'
import TopVenueTable from '../components/features/dashboard/panel/topVenueTable'
import TopStaffTable from '../components/features/dashboard/panel/topStaffTable'
import { 
  REQUEST_GET_BOOKINGS, 
  GET_BOOKINGS_SUCCESS, 
  GET_BOOKINGS_ERROR,
  SET_RECENT_BOOKINGS_PERIOD,
  SET_UPCOMING_BOOKINGS_PERIOD,
  REQUEST_GET_COMPANYINFO,
  GET_COMPANYINFO_SUCCESS,
  GET_COMPANYINFO_ERROR,
} from '../reducers/actionType'

import {
  DASHBOARD_RECENT_BOOKINGS_PANEL,
  DASHBOARD_UPCOMING_BOOKING_PANEL,
  LAST_7_DAYS,
  LAST_30_DAYS,
  NEXT_7_DAYS,
  NEXT_30_DAYS,
} from '../constants'

import currencies from '../models/currencies'

const TotalValue = styled(H1)`
  color: ${colors.dark};
  font-size: 3em;
  font-weight: 500;
`

const ValueDiv = styled.div`
  width: 100%;
  display: flex;
`

const TitleP = styled(P2)`
  margin-right: 2em;
  margin-bottom: 0;
  color: ${colors.grey};
`
const ValueP = styled(P2)`
  color: ${colors.dark};
  margin-top: 0;
  margin-bottom: 0;  
`

const Row = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid gray;  
`

const getSelectedDateRange = dateRange => {
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

const checkBookingInDateRange = (booking, startDate, endDate) => {
  let isInclude = false;
  booking.slots.forEach(itemOne => {
    if (isInclude) return
    if (itemOne.kind === 'single-day') {
      if (startDate <= moment(itemOne.date).valueOf() && moment(itemOne.date).valueOf() <= endDate) {                
        isInclude = true            
        return
      }
    } else if(itemOne.kind === 'multi-day') {
      if (
        startDate <= updatedDate(itemOne.dateRange[0], itemOne.startHour, itemOne.startMinute).valueOf() && 
        updatedDate(itemOne.dateRange[1], itemOne.endHour, itemOne.endMinute).valueOf() <= endDate
      ) {                
        isInclude = true            
        return
      }
    }
  })
  return isInclude;
}

const DashboardPage = () => {

  const { state, dispatch } = useContext(AppReducerContext);
  const [topRecentBooking, setTopRecentBooking] = useState({ id: -1, name: "", count: 0})
  const [recentBookings, setRecentBookings] = useState({
    labels: [...getSelectedDateRange(state.dashboard.recentBookingsPeriod)],
    datasets: [
      {
        label: 'Bookings',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: 'rgba(75,192,192,1)',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(255,255,255,255)',
        pointHoverBorderColor: 'rgba(75,192,192,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
        data: [0, 0, 0, 0, 0, 0, 0, 0]  
      },
    ],
  })
  const [upcomingBooking, setUpcomingBooking] = useState({})
  const [topVenueData, setTopVenueData] = useState({title: "", spaces: []});

  useEffect(() => {
    const getBookings = async () => {
      try {
        dispatch({ type: REQUEST_GET_BOOKINGS });

        const res = await axios.get('/bookings');
        dispatch({
          type: GET_BOOKINGS_SUCCESS,
          payload: res.data.bookings
        })
      } catch (err) {
        dispatch({ type: GET_BOOKINGS_ERROR });
      }
    }
    getBookings();

    const getCompany = async () => {
      try {
        dispatch({ type: REQUEST_GET_COMPANYINFO});

        const res = await axios.get('/company');

        dispatch({
          type: GET_COMPANYINFO_SUCCESS,
          payload: res.data.company,
        })
      } catch (err) {
        dispatch({ type: GET_COMPANYINFO_ERROR });
      }
    }
    getCompany();

  },[])

  const setRecentBookingsFunc = (bookings, period) => {    
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
      startDate = current.startOf('day')
      endDate = current.add(8, 'day').endOfOf('day')
    } else if (period === NEXT_30_DAYS) {
      startDate = current.startOf('day')
      endDate = current.add(31, 'day').endOf('day')
    }    

    state.bookings.bookings.map(item => {
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

    setRecentBookings({
      ...recentBookings,
      labels: [
        ...getSelectedDateRange(period)
      ],
      datasets: [
        {
          ...recentBookings.datasets[0],
          data: [...Object.keys(bookingArray).map(item => {
            return bookingArray[item]
          })]
        }
      ]
    })
  }

  const setUpcomingBookingFunc = (bookings, period) => {

  }

  const setTopVenuFunc = bookings => {    
    const endDay = moment().endOf('day').valueOf()
    const startDay = moment().subtract(1, 'months').startOf('month').startOf('day').valueOf()

    const filteredOne = [];
    bookings.forEach(item => {      
      let isInclude = false;
      item.slots.forEach(itemOne => {
        if (isInclude) return
        if (itemOne.kind === 'single-day') {
          if (
            startDay <= updatedDate(itemOne.date, itemOne.startHour, itemOne.startMinute).valueOf() && 
            updatedDate(itemOne.date, itemOne.endHour, itemOne.endMinute).valueOf() <= endDay
          ) {
            filteredOne.push(item)
            isInclude = true            
            return
          }
        } else if(itemOne.kind === 'multi-day') {
          if (
            startDay <= updatedDate(itemOne.dateRange[0], itemOne.startHour, itemOne.startMinute).valueOf() &&
            updatedDate(itemOne.dateRange[1], itemOne.endHour, itemOne.endMinute).valueOf() <= endDay
          ) {
            filteredOne.push(item)
            isInclude = true            
            return
          }
        }
      })
    })
    
    let sameVenues = [];    
    filteredOne.forEach((item, nIndex) => {
      if (item.venue && item.venue.id) {
        const filterOne = sameVenues.filter(itemOne => itemOne.id === item.venue.id)
        if (filterOne.length > 0)        
          sameVenues = [
            ...sameVenues.map(itemTwo => {
              if (itemTwo.id === item.venue.id)
                return {...itemTwo, count: itemTwo.count + 1, venue: item.venue}
              else return itemTwo
            })
          ]
        else 
          sameVenues.push({id: item.venue.id, count: 1, venue: item.venue})
      }
    })

    let topValue = 0;
    sameVenues.forEach(item => {
      if (item.count > topValue)
      topValue = item.count;
    })
    
    let topVenue = sameVenues.filter(item => item.count === topValue)[0]
    
    let spaceNames = []
    filteredOne.forEach(item => {
      if (item.venue && item.venue.id && topVenue && item.venue.id === topVenue.id) {
        if (item.space && item.space.id)
          spaceNames.push(item.space.id)
      }
    })

    spaceNames = spaceNames.filter(function(item, pos) {
      return spaceNames.indexOf(item) == pos;
    })

    let spaces = [];
    spaceNames.forEach(item => {
      const startOfLastMonth  = startDay
      const endOfLastMonth    = moment(startDay).endOf('month').valueOf()
      const startOfThisMonth  = moment(endDay).startOf('month').valueOf()
      const endOfThisMonth    = endDay      
            
      const lastMonths = filteredOne.filter(itemBooking => {
        if (itemBooking.space.id === item) {
          return checkBookingInDateRange(itemBooking, startOfLastMonth, endOfLastMonth)
        } return false
      })
      
      const thisMonths = filteredOne.filter(itemBooking => {
        if (itemBooking.space.id === item) {
          return checkBookingInDateRange(itemBooking, startOfThisMonth, endOfThisMonth)
        } else return false
      })

      const selectedSpace = filteredOne.filter(itemTwo => itemTwo.spaceId === item)[0]
      spaces.push({ 
        name: selectedSpace.space.name, 
        lastMonth: lastMonths.length,
        thisMonth: thisMonths.length,
      })

    })

    setTopVenueData({
      title: (topVenue && topVenue.venue && topVenue.venue.name) ? topVenue.venue.name : "",
      spaces,
    })
  }

  useEffect(() => {
    setRecentBookingsFunc(state.bookings.bookings, state.dashboard.recentBookingsPeriod)
    setUpcomingBookingFunc(state.bookings.bookings, state.dashboard.upcomingBookingPeriod)
    setTopVenuFunc(state.bookings.bookings)
  }, [
    state.bookings.bookings
  ])

  useEffect(() => {
    setRecentBookingsFunc(state.bookings.bookings, state.dashboard.recentBookingsPeriod)
  }, [state.dashboard.recentBookingsPeriod])

  useEffect(() => {
    setUpcomingBookingFunc(state.bookings.bookings, state.dashboard.upcomingBookingPeriod)
  }, [state.dashboard.upcomingBookingPeriod])

  const changePeriod = (nValue, nKind) => {
    if (nKind === DASHBOARD_RECENT_BOOKINGS_PANEL) {
      dispatch({ type: SET_RECENT_BOOKINGS_PERIOD, payload: nValue })
    } else if (nKind === DASHBOARD_UPCOMING_BOOKING_PANEL) {
      dispatch({ type: SET_RECENT_BOOKINGS_PERIOD, payload: nValue })
    }
  }

  return (
    <Grid columns="1fr 1fr" style={{ width: '100%'}}>
      
      <DashboardPanel 
        title={DASHBOARD_RECENT_BOOKINGS_PANEL}
        selectedDate={state.dashboard.recentBookingsPeriod}
        timePeriods={[LAST_7_DAYS, LAST_30_DAYS]}        
      >        
        <TotalValue>
          {recentBookings.datasets[0].data.reduce((partial_sum, a) => partial_sum + a, 0)} booked
        </TotalValue>
        
        <Line
          data={recentBookings} 
          options={{
            legend: {
              position: "bottom",
            },
          }}
        />
      </DashboardPanel>

      <DashboardPanel 
        title={DASHBOARD_UPCOMING_BOOKING_PANEL}
        selectedDate={state.dashboard.upcomingBookingPeriod}
        timePeriods={[NEXT_7_DAYS, NEXT_30_DAYS]}        
      >
        <TotalValue>1 booked</TotalValue>
        <ValueDiv>
          <TitleP>Confirmed appointments</TitleP>
          <ValueP>1</ValueP>
        </ValueDiv>
        <ValueDiv>
          <TitleP>Cancelled appointments</TitleP>
          <ValueP>0</ValueP>
        </ValueDiv>
      </DashboardPanel>
      
      <TopVenueTable data={topVenueData}/>   
      <TopStaffTable />           

    </Grid>
  )
}

export default DashboardPage