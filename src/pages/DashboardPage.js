import React, { useEffect, useContext } from "react";
import axios from "axios";

import { AppReducerContext } from "../contexts/AppReducerContext";
import Grid from "../components/layout/Grid";

import RecentBookingPanel from "../components/features/dashboard/panel/RecentBookingPanel";
import UpcomingBookingPanel from "../components/features/dashboard/panel/UpcomingBookingPanel";
// import TopVenueTable from "../components/features/dashboard/panel/TopVenueTable"
// import TopStaffTable from "../components/features/dashboard/panel/TopStaffTable"

import { 
  REQUEST_GET_BOOKINGS, 
  GET_BOOKINGS_SUCCESS, 
  GET_BOOKINGS_ERROR
} from "../reducers/actionType";


const DashboardPage = () => {

  const { dispatch } = useContext(AppReducerContext);

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
  },[]);

  return (
    <Grid columns="1fr 1fr" style={{ width: "100%"}}>
      <RecentBookingPanel />
      <UpcomingBookingPanel />      
      {/* <TopVenueTable />
      <TopStaffTable /> */}
    </Grid>
  );
};

export default DashboardPage;