import React ,{ useEffect, useState, useContext } from 'react'
import styled from "styled-components"

import axios from 'axios'
import moment from 'moment'
import { Line } from 'react-chartjs-2';

import { AppReducerContext } from '../contexts/AppReducerContext'

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
  SET_RECENT_SALES_PERIOD,
  SET_UPCOMING_BOOKING_PERIOD,
} from '../reducers/actionType'

import {
  DASHBOARD_RECENT_SALES_PANEL,
  DASHBOARD_UPCOMING_BOOKING_PANEL,
} from '../constants'

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
  if (dateRange === 'Last 7 days') {
    let n = 8
    while (n>0) {
      arrDate.push(current.format('ddd D'))
      current.subtract(1, 'day')
      n--
    }
    arrDate.reverse();
  } else if (dateRange === 'Last 30 days') {
    let n = 31
    while (n>0) {
      arrDate.push(current.format('ddd D'))
      current.subtract(1, 'day')
      n--
    }
    arrDate.reverse();
  } else if (dateRange === 'Next 7 days') {    
    let n = 0;
    while (n<8) {
      arrDate.push(current.format('ddd D'))
      current.add(1, 'day')
      n++
    }
  } else if (dateRange === 'Next 30 days') {
    let n=0;
    while (n<31) {
      arrDate.push(current.format('ddd D'))
      current.add(1, 'day')
      n++
    }
  }
  return arrDate;  
}

const DashboardPage = () => {

  const { state, dispatch } = useContext(AppReducerContext);
  const [recentSales, setRecentSales] = useState({
    labels: [...getSelectedDateRange(state.dashboard.recentSalesPeriod)],
    datasets: [
      {
        label: 'Sales',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
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
        data: [65, 59, 80, 81, 56, 55, 40, 40]  
      },
    ],
  })
  const [upcomingBooking, setUpcomingBooking] = useState({})

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
  },[])

  const setRecentSalesFunc = (bookings, period) => {
    // const filteredOne = bookings.filter(item => )
  }

  const setUpcomingBookingFunc = (bookings, period) => {

  }

  useEffect(() => {
    setRecentSalesFunc(state.bookings.bookings, state.dashboard.recentSalesPeriod)
    setUpcomingBookingFunc(state.bookings.bookings, state.dashboard.upcomingBookingPeriod)
  }, [
    state.bookings.bookings
  ])

  useEffect(() => {
    setRecentSalesFunc(state.bookings.bookings, state.dashboard.recentSalesPeriod)
  }, [state.dashboard.recentSalesPeriod])

  useEffect(() => {
    setUpcomingBookingFunc(state.bookings.bookings, state.dashboard.upcomingBookingPeriod)
  }, [state.dashboard.upcomingBookingPeriod])

  const changePeriod = (nValue, nKind) => {
    if (nKind === DASHBOARD_RECENT_SALES_PANEL) {
      dispatch({ type: SET_RECENT_SALES_PERIOD, payload: nValue })
    } else if (nKind === DASHBOARD_UPCOMING_BOOKING_PANEL) {
      dispatch({ type: SET_RECENT_SALES_PERIOD, payload: nValue })
    }
  }

  return (
    <Grid columns="1fr 1fr" style={{ width: '100%'}}>
      
      <DashboardPanel 
        title={DASHBOARD_RECENT_SALES_PANEL}
        selectedDate={state.dashboard.recentSalesPeriod}
        timePeriods={['Last 7 days', 'Last 30 days']}        
      >        
        <TotalValue>$25</TotalValue>
        <ValueDiv>
          <TitleP>Bookings</TitleP>
          <ValueP>1</ValueP>
        </ValueDiv>
        <ValueDiv style={{marginBottom: '2em'}}>
          <TitleP>Booking Value</TitleP>
          <ValueP>$25</ValueP>
        </ValueDiv>
        <Line
          data={recentSales} 
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
        timePeriods={['Next 7 days', 'Next 30 days']}        
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
      
      <TopVenueTable />   
      <TopStaffTable />           

    </Grid>
  )
}

export default DashboardPage