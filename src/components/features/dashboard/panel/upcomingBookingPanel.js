import React ,{ useEffect, useState, useContext } from 'react'
import styled from "styled-components"
import { Bar } from 'react-chartjs-2'

import {
  getPanelDateRange,
  getBookingWithDateRange,
} from '../../../../utils/dashboard'

import H1 from '../../../typography/H1'
import colors from "../../../style/colors"

import { AppReducerContext } from '../../../../contexts/AppReducerContext'

import TopBanner from './topBanner'

import {
  DASHBOARD_UPCOMING_BOOKING_PANEL, NEXT_7_DAYS, NEXT_30_DAYS
} from '../../../../constants'

const PanelDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1em;
  background-color: white;
  box-shadow: 0 5px 15px 5px rgba(164, 173, 186, 0.25);
  border-radius: 3px;
`
const TotalValue = styled(H1)`
  color: ${colors.dark};
  font-size: 3em;
  font-weight: 500;
`

const UpcomingBookingPanel = () => {

  const { state, dispatch } = useContext(AppReducerContext);  

  const [upcomingBookings, setUpcomingBookings] = useState({
    labels: [...getPanelDateRange(state.dashboard.upcomingBookingsPeriod)],
    datasets: [
      {
        label: 'Bookings',
        backgroundColor: 'rgba(43, 114, 189, 0.6)',
        borderColor: 'rgb(43, 114, 189)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(43, 114, 189,0.8)',
        hoverBorderColor: 'rgb(43, 114, 189);',
        data: [0, 0, 0, 0, 0, 0, 0, 0]
      }
    ]  
  })

  useEffect(() => {
    const bookingArray = getBookingWithDateRange(
      state.bookings.bookings, 
      state.dashboard.upcomingBookingPeriod, 
    )

    setUpcomingBookings({
      ...upcomingBookings,
      labels: [
        ...getPanelDateRange(state.dashboard.upcomingBookingPeriod)
      ],
      datasets: [
        {
          ...upcomingBookings.datasets[0],
          data: [...Object.keys(bookingArray).map(item => {
            return bookingArray[item]
          })]
        }
      ]
    })

  }, [
    state.dashboard.upcomingBookingPeriod, 
    state.bookings.bookings
  ])

  return (
    <PanelDiv>
      <TopBanner 
        title={DASHBOARD_UPCOMING_BOOKING_PANEL} 
        selectedDate={state.dashboard.upcomingBookingPeriod} 
        timePeriods={[NEXT_7_DAYS, NEXT_30_DAYS]}
      />
      <TotalValue>
        {upcomingBookings.datasets[0].data.reduce((partial_sum, a) => partial_sum + a, 0)} booked
      </TotalValue>
      <Bar
        data={upcomingBookings} 
        options={{
          legend: {
            position: "bottom",
            display: false,
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  min: 0,
                  callback: function(value, index, values) {
                      if (Math.floor(value) === value) {
                          return value;
                      }
                  }  
                }
              }
            ]
          }      
        }}
      />
    </PanelDiv>
  )
}

export default UpcomingBookingPanel