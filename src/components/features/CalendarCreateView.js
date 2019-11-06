import React, { useContext, useState, useEffect } from "react"
import axios from 'axios'
import styled from "styled-components";
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
  align-items: center;

  .multi-select {
    width: 40%;
    margin-left: 1rem;
  }
`;

const RemoveButton = styled(SvgButton)`
  margin-left: auto;
`;

const CalendarCreateView = ({calendarViewData}) => {

  const { state, dispatch } = useContext(AppReducerContext);
  const [calendarViews, setCalendarViews] = useState([...calendarViewData.views])
  const [allSpaces, setAllSpaces] = useState([])

  useEffect(() => {
    try {
      axios.get('/userspaces').then(res => {
        setAllSpaces([ ...res.data.spaces ])
      })
    } catch (err) {
      setAllSpaces([])
    }
  }, [])

  const handleClickAddView = () => {

    setCalendarViews([
      ...calendarViews,
      {
        title: 'View ' + calendarViews.length,
        spaces: allSpaces.length > 0 ? [{id: allSpaces[0].id, name: allSpaces[0].name}] : [],
      }
    ])

    if( !calendarViewData.id || calendarViewData.id === -1) {

    } else {

    }
  }

  const handleClickSave = () => {

  }

  const handleChangeSpaces = (selected, nIndex) => {
    debugger;
    const newOne = [ ...calendarViews]
    newOne[nIndex].spaces = [ ...getSelectedSpaces(selected) ]
    setCalendarViews([ ...newOne])
  }

  const getSelectedSpaces = (selectedIds) => {
    const filterOne = allSpaces.filter(item => selectedIds.includes(item.id))
    return filterOne.map(item => {
      return { id: item.id, name: item.name }
    })
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
        <P2>Here you can create views over your individual spaces that everyone can use for quick filtering(e.g Level-2 rooms, East-wing studio)</P2>
        { calendarViews.map((item, nIndex)=> {
          return <Row key={item}>
            <TableEditableValue 
              value={item.title} 
              label=""
              // onChange={value => {}}
              style={{width: '40%'}}
            />
            <MultiSelect 
              options={allSpaces.map(item => {
                return {value: item.id, label: item.name}
              })}
              selected={item.spaces.map(itemOne => itemOne.id)}
              label=""
              onSelectedChanged={selected => handleChangeSpaces(selected, nIndex)}
            />
            <RemoveButton
              size={20}
              svg={removeSvg}
              // onClick={() => handleClickDeleteRow(nKey, nKeyTwo, nIndex)}
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