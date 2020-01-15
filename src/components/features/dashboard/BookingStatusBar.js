import React, {useEffect, useState, useContext} from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

import P1 from "../../typography/P1"

import { AppReducerContext, getStatuColor } from "../../../contexts/AppReducerContext";
import ColoredDot from "../../buttons/ColoredDot";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 1em;
  background-color: white;
  box-shadow: 0 5px 15px 5px rgba(164, 173, 186, 0.25);
  border-radius: 3px;
  margin-top: 3em;
  height: 100%;
`;

const StatusBarDiv = styled.div`
  height: 100%;  
  flex: 1 1 auto;  
  display: flex;  
  align-items: center;  
  justify-content: center;
  border: 1px solid #E6E8E9;
  border-left: none;
  background: #F2F5F7;
  cursor: pointer;
  min-height: 60px;
  &:first-child {
    border-left: 1px solid #E6E8E9;
  }
`

const StyledP1 = styled(P1)`
  margin: 0;
`

const BookingStatusBar = props => {

  const { state } = useContext(AppReducerContext)
  const [bookingStatusCount, setBookingStatusCount] = useState({})

  useEffect(() => {
    const temp = {};
    state.bookings.bookingStatus.map(item => {
      const filteredOne = state.bookings.bookings.filter(itemOne => itemOne.statusId === item.id)
      temp[item.id] = filteredOne.length;
    })    
    setBookingStatusCount({...temp})
  }, [state.bookings.bookings, state.bookings.bookingStatus])

  const handleClickStatus = statusName => {
    props.history.push({
      pathname: '/bookings',
      state: { status: statusName }
    })    
  }

  return (
    <Container>
      <StatusBarDiv  onClick={() => handleClickStatus('All')}>
        <StyledP1>
          All ({state.bookings.bookings.length})
        </StyledP1>
      </StatusBarDiv>
      {
        state.bookings.bookingStatus.map(item => {
          return (
            <StatusBarDiv onClick={() => handleClickStatus(item.name)}>
              <StyledP1>
                <ColoredDot color={getStatuColor(item.name)} style={{marginRight: 5}} />
                {item.name}
                &nbsp;
                {
                  `(${bookingStatusCount[item.id]})`
                }
              </StyledP1>
            </StatusBarDiv>
          )
        })
      }
    </Container>
  )
}

export default withRouter(BookingStatusBar)