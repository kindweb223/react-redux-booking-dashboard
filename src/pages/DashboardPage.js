import React ,{ useEffect, useState, useContext } from 'react'
import styled from "styled-components"

import axios from 'axios'
import moment from 'moment'

import { AppReducerContext } from '../contexts/AppReducerContext'

import { updatedDate } from "../utils/dates";

import colors from "../components/style/colors"
import Grid from '../components/layout/Grid'
import H1 from '../components/typography/H1'
import H3 from '../components/typography/H3'
import P2 from '../components/typography/P2'

import RecentBookingPanel from '../components/features/dashboard/panel/recentBookingPanel'
import UpcomingBookingPanel from '../components/features/dashboard/panel/UpcomingBookingPanel'
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

const DashboardPage = () => {

  const { state, dispatch } = useContext(AppReducerContext);
  const [topRecentBooking, setTopRecentBooking] = useState({ id: -1, name: "", count: 0})

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



  return (
    <Grid columns="1fr 1fr" style={{ width: '100%'}}>      
      <RecentBookingPanel />
      <UpcomingBookingPanel />      
      {/* <TopVenueTable />
      <TopStaffTable /> */}
    </Grid>
  )
}

export default DashboardPage