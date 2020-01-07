import React from 'react'
import styled from "styled-components"

import Grid from '../components/layout/Grid'
import DashboardPanel from '../components/features/dashboard/panel/dashboardPanel'

const DashboardPage = () => {

  return (
    <Grid columns="1fr 1fr" style={{ width: '100%'}}>
      
      <DashboardPanel 
        title="Recent Sales"
        selectedDate="Last 7 days"
      >        
      </DashboardPanel>

      <DashboardPanel 
        title="Upcoming Bookings"
        selectedDate="Next 7 days"
      >
      </DashboardPanel>

    </Grid>
  )
}

export default DashboardPage