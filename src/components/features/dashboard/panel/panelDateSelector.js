import React ,{ useEffect, useState, useRef, useContext } from 'react'
import ReactDOM from "react-dom";
import styled from "styled-components"

import colors from "../../../style/colors"

import P2 from '../../../typography/P2'
import { TablePicker } from '../../../tables/tables'
import Button from '../../../buttons/Button'

import { AppReducerContext } from '../../../../contexts/AppReducerContext'

import { 
  DASHBOARD_RECENT_BOOKINGS_PANEL,
  DASHBOARD_UPCOMING_BOOKING_PANEL,
} from '../../../../constants'

import {
  SET_RECENT_BOOKINGS_PERIOD,
  SET_UPCOMING_BOOKINGS_PERIOD,
} from '../../../../reducers/actionType'

const Container = styled.div`
  position: relative;
  height: 28px;
`

const WrapperButton = styled.div`
  width: 38px;
  height: 28px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  margin-top: 4px;

  &:hover {
    background-color: ${colors.light_grey}
  }

  svg {
    width: 19px;
  }
`

const ViewDropDown = styled.div`
  position: absolute;
  width: 290px;
  right: 0;
  top: calc(100% + 14px);
  display: flex;
  flex-direction: column;
  padding: 1em;
  background-color: white;
  box-shadow: 0 5px 15px 5px rgba(164, 173, 186, 0.2);
  border-radius: 3px;
  border-color: #f7f7f8;
`

const ViewDropDownArrow = styled.span`
  &:before {
    display: block;
    content: '';
    border: 1px solid #eef0f2 ;
    position: absolute;
    height: 8px;
    width: 8px;
    transform: rotate(45deg);
    background-color: white;
    box-shadow: 0px 1.5px 1px rgba(0,0,0,0.05);
    right: 13.5px;
    top: calc(100% + 8px);
  }
`

const PanelDateSelector = ({
  panelKind,
  timePeriodOptions,
  selectedDate,
}) => {

  const { state, dispatch } = useContext(AppReducerContext)

  const [openDropDown, setOpenDropDown] = useState(false)
  const [timePeriod, setTimePeriod] = useState(selectedDate)

  useEffect(() => {
    setTimePeriod(selectedDate)
  }, [selectedDate])

  const refOne = useRef(null);

  useEffect(() => {
    const handleDocumentClick = event => {
      if (refOne.current) {
        if (!ReactDOM.findDOMNode(refOne.current).contains(event.target)) {
          if (openDropDown) {
            setOpenDropDown(false)
            setTimePeriod(selectedDate)
          }
        }
      }
    };

    document.addEventListener("click", handleDocumentClick, false);

    return () => {
      document.removeEventListener("click", handleDocumentClick, false);
    };

  }, [refOne, openDropDown]);

  const handleChangeTime = selectedOne => {
    setTimePeriod(selectedOne)
  }

  const applyChanges = () => {
    setOpenDropDown(false)
    setTimeout(() => {
      if (panelKind === DASHBOARD_RECENT_BOOKINGS_PANEL) {
        dispatch({ type: SET_RECENT_BOOKINGS_PERIOD, payload: timePeriod })
      } else if (panelKind === DASHBOARD_UPCOMING_BOOKING_PANEL) {
        dispatch({ type: SET_UPCOMING_BOOKINGS_PERIOD, payload: timePeriod })
      }
    }, 1)    
  }
  
  return (
    <Container ref={refOne}>
      <WrapperButton onClick={() => setOpenDropDown(!openDropDown)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 6">
          <circle cx="3" cy="3" r="3" fill={colors.dark}></circle>
          <circle cx="11" cy="3" r="3" fill={colors.dark}></circle>
          <circle cx="19" cy="3" r="3" fill={colors.dark}></circle>
        </svg>
      </WrapperButton>
      {
        openDropDown && (
          <React.Fragment>
            <ViewDropDownArrow />
            <ViewDropDown>        
              {timePeriod}
              <TablePicker 
                label="Time Period"
                options={timePeriodOptions}
                selectedOption={timePeriod}
                onOptionSelected={selectedOne => handleChangeTime(selectedOne)}
                style={{width: '100%'}}
              />
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1em'}}>
                <Button 
                  outline style={{width: '124px'}}
                  onClick={() => setOpenDropDown(false)}
                >
                  Cancel
                </Button>
                <Button primary style={{width: '124px'}} onClick={applyChanges}>
                  Apply Changes
                </Button>
              </div>
            </ViewDropDown>
          </React.Fragment>
        )
      }      
    </Container>
  )
}

export default PanelDateSelector