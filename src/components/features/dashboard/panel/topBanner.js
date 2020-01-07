import React from 'react'
import styled from "styled-components"

import colors from "../../../style/colors"

import H3 from "../../../typography/H3"
import P2 from "../../../typography/P2"

import PanelDateSelector from './panelDateSelector'

const Container = styled.div`
  display: flex;  
  width: 100%;
  justify-content: space-between;
`

const TitleDiv = styled.div`
  display: flex;
  flex-direction: column;
`

const TopBanner = ({
  title,
  selectedDate,
}) => {
  return (
    <Container>
      <TitleDiv>
        <H3 style={{marginBottom: '0'}}>{title}</H3>
        <P2 style={{color: `${colors.grey}`, marginTop: '0'}}>{selectedDate}</P2>
      </TitleDiv>
      <PanelDateSelector />
    </Container>
  )
}

export default TopBanner