import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import arrowDown from "../../images/ui/arrowDown.svg";

import { AppReducerContext } from "../../contexts/AppReducerContext";
import { setCalendarSettingAction } from '../../actions/calendar'

const Wrapper = styled.div`
  position: relative;
  margin-left: 1em;
  @media (max-width: 1020px) {
    display: none;
  }

  .react-datepicker-wrapper {
    position: absolute;
    left: 0;    
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;

    .react-datepicker__input-container {
      input {
        cursor: pointer;
      }      
    }
  }

  .react-datepicker-popper {
    z-index: 15;
  }
`;

const Title = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  text-align: center;
  border: 1px solid #E6E8E9;
  border-radius: 0.25em;
  height: 34px;
  padding: 0 0.7em;
  width: auto;
  flex: 0 0 auto;
  background: #ffffff;
  color: #93989F;
  box-shadow: 0px 1.5px 1px rgba(0,0,0,0.05);
  cursor: pointer;
  outline: none;  
  user-select: none;  
  animation: 1s 0.3s linear infinite;  
  animation-timing-function: ease-in-out;
`
const CalendarDatePicker = props => {

  const { state, dispatch } = useContext(AppReducerContext)

  const [openViewDropDown, setOpenViewDropDown] = useState(false)

  const handleCalendarOpen = () => {
    setOpenViewDropDown(true)
  }

  return (
    <Wrapper {...props}>
      <Title>
        {props.title}
        <img
          src={arrowDown}
          alt="Show options"
          style={{ transform: openViewDropDown ? "scaleY(-1)" : "", marginLeft: 5 }}
        />
      </Title>
      <DatePicker 
        selected={state.calendarSettings.selectedDate}
        onChange={date => setCalendarSettingAction(dispatch, { ...state.calendarSettings, selectedDate: date})}
        onClickOutside={() => setOpenViewDropDown(false)}
        onInputClick={() => setOpenViewDropDown(!openViewDropDown)}
        onSelect={() => setOpenViewDropDown(false)}
        open={openViewDropDown}
      />
    </Wrapper>
  )
}

export default CalendarDatePicker;

