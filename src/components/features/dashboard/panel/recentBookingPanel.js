import React ,{ useEffect, useState, useContext } from 'react'
import styled from "styled-components"
import { Line } from 'react-chartjs-2'

import {
  getPanelDateRange,
  getBookingWithDateRange,
} from '../../../../utils/dashboard'

import H1 from '../../../typography/H1'
import colors from "../../../style/colors"

import { AppReducerContext } from '../../../../contexts/AppReducerContext'

import TopBanner from './topBanner'

import {
  DASHBOARD_RECENT_BOOKINGS_PANEL, LAST_7_DAYS, LAST_30_DAYS
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

const RecentBookingPanel = () => {

  const { state, dispatch } = useContext(AppReducerContext);  

  const [recentBookings, setRecentBookings] = useState({
    labels: [
      ...getPanelDateRange(state.dashboard.recentBookingsPeriod)
    ],
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

  useEffect(() => {
    const bookingArray = getBookingWithDateRange(
      state.bookings.bookings, 
      state.dashboard.recentBookingsPeriod, 
    )

    setRecentBookings({
      ...recentBookings,
      labels: [
        ...getPanelDateRange(state.dashboard.recentBookingsPeriod)
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

  }, [
    state.dashboard.recentBookingsPeriod, 
    state.bookings.bookings
  ])

  return (
    <PanelDiv>
      <TopBanner 
        title={DASHBOARD_RECENT_BOOKINGS_PANEL} 
        selectedDate={state.dashboard.recentBookingsPeriod} 
        timePeriods={[LAST_7_DAYS, LAST_30_DAYS]}
      />
      <TotalValue>
        {recentBookings.datasets[0].data.reduce((partial_sum, a) => partial_sum + a, 0)} booked
      </TotalValue>
      <Line
        data={recentBookings} 
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

export default RecentBookingPanel