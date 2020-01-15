import React, { useEffect, useContext } from "react";
import axios from "axios";
import styled from "styled-components";

import { AppReducerContext } from "../contexts/AppReducerContext";
import Grid from "../components/layout/Grid";

import RecentBookingPanel from "../components/features/dashboard/panel/RecentBookingPanel";
import UpcomingBookingPanel from "../components/features/dashboard/panel/UpcomingBookingPanel";
// import TopVenueTable from "../components/features/dashboard/panel/TopVenueTable"
// import TopStaffTable from "../components/features/dashboard/panel/TopStaffTable"
import BookingStatusBar from "../components/features/dashboard/BookingStatusBar"

import { 
  REQUEST_GET_BOOKINGS, 
  GET_BOOKINGS_SUCCESS, 
  GET_BOOKINGS_ERROR,
  REQUEST_GET_BOOKING_BOOKINGSTATUS,
  GET_BOOKING_BOOKINGSTATUS_SUCCESS,
  GET_BOOKING_BOOKINGSATTUS_ERROR
} from "../reducers/actionType";
import { helpers } from "chart.js";

const DashboardPage = () => {

  const { state, dispatch } = useContext(AppReducerContext);

  useEffect(() => {
    const getBookings = async () => {
      try {
        dispatch({ type: REQUEST_GET_BOOKINGS });

        const res = await axios.get("/bookings");
        dispatch({
          type: GET_BOOKINGS_SUCCESS,
          payload: res.data.bookings
        });
      } catch (err) {
        dispatch({ type: GET_BOOKINGS_ERROR });
      }
    }
    getBookings();

    const getBookingStatus = async () => {

      try {
        dispatch({ type: REQUEST_GET_BOOKING_BOOKINGSTATUS });

        const res = await axios.get('/statuses');

        dispatch({
          type: GET_BOOKING_BOOKINGSTATUS_SUCCESS,
          payload: res.data.statuses
        });
      } catch(err) {
        dispatch({ type: GET_BOOKING_BOOKINGSATTUS_ERROR });
      }

    }
    getBookingStatus();
  },[]);

  return (
    <div>
      <Grid columns="1fr 1fr" style={{ width: "100%"}}>
        <RecentBookingPanel />
        <UpcomingBookingPanel />
        {/* <TopVenueTable />
        <TopStaffTable /> */}
      </Grid>      
      <BookingStatusBar />      
    </div>
  );
};

export default DashboardPage;