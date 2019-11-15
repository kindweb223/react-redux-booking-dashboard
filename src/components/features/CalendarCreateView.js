import React, { useContext, useState, useEffect } from "react"
import axios from 'axios'
import styled from "styled-components";
import { css } from "emotion";
import { AppReducerContext } from '../../contexts/AppReducerContext'
import MultiSelect from "@khanacademy/react-multi-select";
import {
  ModalContainer,
  ModalTopSection,
  ModalTitleAndButtons,
  ModalBottomSection
} from "../modals/containers";
import H3 from '../typography/H3'
import P2 from '../typography/P2'
import Button from '../buttons/Button'
import { TableEditableValue } from "../tables/tables";
import SpinnerContainer from "../layout/Spinner";
import SvgButton from "../buttons/SvgButton";
import removeSvg from "../../images/ui/remove.svg";

import {
  REQUEST_CREATE_CALENDAR_CUSTOM_VIEW, CREATE_CALENDAR_CUSTOM_VIEW_SUCCESS, CREATE_CALENDAR_CUSTOM_VIEW_ERROR,
  REQUSET_UPDATE_CALENDAR_CUSTOM_VIEW, UPDATE_CALENDAR_CUSTOM_VIEW_SUCCESS, UPDATE_CALENDAR_CUSTOM_VIEW_ERROR,
} from '../../reducers/actionType'

const Row = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 1rem;

  .multi-select {    
    width: 100%;
    .select-panel {
      >label.select-item {
        display: none !important;        
      }
    }
    .dropdown-heading {      
      border: 1px solid #e6e8e9 !important;
    }
    .dropdown-content {
      border: 1px solid #e6e8e9 !important;
    }
  }
`;

const CustomeCol = styled.div`
  display: flex;
  width: 40%;
  margin-right: 1rem;
  flex-direction: column;

  &.error {
    .dropdown-heading {
      border: 1px solid #E92579 !important;
    }
  }
`;

const RemoveButton = styled(SvgButton)`
  margin-left: auto;
  margin-top: 8px;
`;

const ErrorP = styled.p`
  color: #E92579;            
  margin: 0.2em 0 0 0;
  padding: 0 0.6em;
  font-size: 0.8em;
`;

const CalendarCreateView = ({
  calendarViewData,
  hideModal,
}) => {

  const { state, dispatch } = useContext(AppReducerContext);
  const [calendarViews, setCalendarViews] = useState([...calendarViewData.views])

  const handleClickAddView = () => {

    setCalendarViews([
      ...calendarViews,
      {
        title: 'View ' + calendarViews.length,
        spaces: state.calendarViews.allSpaces.length > 0 ? [{id: state.calendarViews.allSpaces[0].id, name: state.calendarViews.allSpaces[0].name}] : [],
      }
    ])

    if( !calendarViewData.id || calendarViewData.id === -1) {

    } else {

    }
  }

  const handleClickSave = async () => {
    let isValidate = true;
    calendarViews.forEach(item => {
      if (item.title.length === 0 || item.spaces.length === 0)
        isValidate = false
    })

    if (!isValidate)
      return;

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    if (calendarViewData.id === -1) {
      try {
        const res = await axios.post('/calendarview', {views: JSON.stringify(calendarViews)}, config)      
        dispatch({
          type: CREATE_CALENDAR_CUSTOM_VIEW_SUCCESS,
          payload: res.data.calendarView
        })
        hideModal()
      } catch (err) {
        dispatch({ type: CREATE_CALENDAR_CUSTOM_VIEW_ERROR })
      }      
    } else {
      try {
        const res = await axios.put(
          `/calendarview/${calendarViewData.id}`, 
          {views: JSON.stringify(calendarViews)}, 
          config
        )

        dispatch({
          type: UPDATE_CALENDAR_CUSTOM_VIEW_SUCCESS,
          payload: res.data.calendarView
        })

        hideModal()
      } catch (err) {
        dispatch({ type: UPDATE_CALENDAR_CUSTOM_VIEW_ERROR })
      }
    }
  }

  const handleChangeSpaces = (selected, nIndex) => {
    const newOne = [ ...calendarViews]
    newOne[nIndex].spaces = [ ...getSelectedSpaces(selected) ]
    setCalendarViews([ ...newOne])
  }

  const handleChangeViewTitle = (value, nIndex) => {
    const newOne = [ ...calendarViews ]
    newOne[nIndex].title = value
    setCalendarViews([ ...newOne ])
  }

  const handleClickDeleteView = nIndex => {
    setCalendarViews([
      ...calendarViews.filter((item, key) => key !== nIndex)
    ])
  }

  const getSelectedSpaces = (selectedIds) => {
    const filterOne = state.calendarViews.allSpaces.filter(item => selectedIds.includes(item.id))
    return filterOne.map(item => {
      return { id: item.id, name: item.name }
    })
  }

  const getSelectedAllString = spaces => {
    let strAll = "";
    spaces.forEach((item, nIndex) => {
      strAll += item.name
      if (nIndex < spaces.length-1)
        strAll += ', '
    })
    return strAll;
  }

  return (
    <ModalContainer>
      <SpinnerContainer />
      <ModalTopSection>        
        <ModalTitleAndButtons>
          <H3 style={{margin: 0}}>Custom Views</H3>
          <div>
            <Button primary onClick={handleClickSave}>
              Save
            </Button>
          </div>
        </ModalTitleAndButtons>
      </ModalTopSection>
      <ModalBottomSection>
        <P2>
          Create custom calendar views of your spaces below, give your view a name and list the spaces associated with that name. 
          This is so you can find your spaces fast. (E.g Top Floor Spaces, Bar Spaces or Outdoor Spaces)
        </P2>
        { calendarViews.map((item, nIndex)=> {
          return <Row key={nIndex}>
            <CustomeCol>
              <TableEditableValue 
                value={item.title} 
                label=""
                onChange={value => {handleChangeViewTitle(value, nIndex)}}
                style={{width: '100%'}}
                className={(item.title.length === 0 ? "error" : "")}

              />
              {
                item.title.length === 0 && 
                <ErrorP>Don't forget the name!</ErrorP>
              }
            </CustomeCol>
            <CustomeCol className={(item.spaces.length === 0 ? "error" : "")}>
              <MultiSelect 
                options={state.calendarViews.allSpaces.map(item => {
                  return {value: item.id, label: item.name}
                })}
                selected={item.spaces.map(itemOne => itemOne.id)}
                label=""
                onSelectedChanged={selected => handleChangeSpaces(selected, nIndex)}
                disableSearch={true}
                overrideStrings={{
                  allItemsAreSelected: getSelectedAllString(item.spaces),
                  selectSomeItems: "Select Spaces",
                }}
              />
              {
                item.spaces.length === 0 && 
                <ErrorP>Please select at least one space for view</ErrorP>
              }
            </CustomeCol>
            <RemoveButton
              size={20}
              svg={removeSvg}
              onClick={() => handleClickDeleteView(nIndex)}
            />
          </Row>
        })}      
        <Button primary onClick={handleClickAddView} style={{marginTop: '1rem'}}>
          {calendarViews.length === 0 ? 'Create your first view' : 'Add another view'}
        </Button>
      </ModalBottomSection>
    </ModalContainer>
  )
}

export default CalendarCreateView