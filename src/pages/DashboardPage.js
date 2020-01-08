import React from 'react'
import styled from "styled-components"

import colors from "../components/style/colors"
import Grid from '../components/layout/Grid'
import H1 from '../components/typography/H1'
import P2 from '../components/typography/P2'

import DashboardPanel from '../components/features/dashboard/panel/dashboardPanel'

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

const DashboardPage = () => {

  return (
    <Grid columns="1fr 1fr" style={{ width: '100%'}}>
      
      <DashboardPanel 
        title="Recent Sales"
        selectedDate="Last 7 days"
        timePeriods={['Last 7 days', 'Next 30 days']}
      >        
        <TotalValue>$25</TotalValue>
        <ValueDiv>
          <TitleP>Bookings</TitleP>
          <ValueP>1</ValueP>
        </ValueDiv>
        <ValueDiv>
          <TitleP>Booking Value</TitleP>
          <ValueP>$25</ValueP>
        </ValueDiv>
      </DashboardPanel>

      <DashboardPanel 
        title="Upcoming Bookings"
        selectedDate="Next 7 days"
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

    </Grid>
  )
}

export default DashboardPage