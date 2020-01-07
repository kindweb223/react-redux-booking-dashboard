import React from 'react'
import styled from "styled-components"

import TopBanner from './topBanner'

const PanelDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1em;
  background-color: white;
  box-shadow: 0 5px 15px 5px rgba(164, 173, 186, 0.25);
  border-radius: 3px;
`

const DashboardPanel = ({
  title,
  selectedDate,
}) => {

  return (
    <PanelDiv>
      <TopBanner title={title} selectedDate={selectedDate} />
    </PanelDiv>
  )
}

export default DashboardPanel