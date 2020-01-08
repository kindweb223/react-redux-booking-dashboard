import React from 'react'
import styled from 'styled-components'

import colors from '../../../style/colors'
import H3 from '../../../typography/H3'
import P2 from '../../../typography/P2'

const PanelDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1em;
  background-color: white;
  box-shadow: 0 5px 15px 5px rgba(164, 173, 186, 0.25);
  border-radius: 3px;
`

const Row = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #E6E8E9;
`

const NameColumn = styled(P2)`
  width: 30%;
  margin-top: 0.6em;
`
const ValueColmun = styled(P2)`
  width: 35%;
  text-align: right;
  margin-top: 0.6em;
`

const TopVenueTable = () => {
  return (
    <PanelDiv>
      <H3>Top Venue</H3>
      <Row>
        <NameColumn style={{color: `${colors.grey}`}}>Space</NameColumn>
        <ValueColmun style={{color: `${colors.grey}`}}>This momth</ValueColmun>
        <ValueColmun style={{color: `${colors.grey}`}}>Last momth</ValueColmun>
      </Row>
      <Row>
        <NameColumn>Space1</NameColumn>
        <ValueColmun>1</ValueColmun>
        <ValueColmun>2</ValueColmun>
      </Row>
      <Row>
        <NameColumn>Space2</NameColumn>
        <ValueColmun>3</ValueColmun>
        <ValueColmun>4</ValueColmun>
      </Row>
    </PanelDiv>
  )
}

export default TopVenueTable