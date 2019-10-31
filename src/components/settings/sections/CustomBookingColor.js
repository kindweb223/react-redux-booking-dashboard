import React, {useState, useContext, useEffect} from "react";
import axios from 'axios';
import styled from "styled-components";

import colors from "../../style/colors";
import P2 from "../../typography/P2";
import Button from "../../buttons/Button";
import SpinnerContainer from "../../layout/Spinner";
import AddGlyph from "../../../images/Glyphs/AddGlyph";
import { TablePicker, TableEditableValue } from "../../tables/tables";

import {
  AppReducerContext,
} from "../../../contexts/AppReducerContext";

import { BOOKING_COLOR_CONDITION_KEYS } from '../../../constants';
import {
  REQUEST_GET_CUSTOM_BOOKING_COLOR, GET_CUSTOM_BOOKING_COLOR_SUCCESS, GET_CUSTOM_BOOKING_COLOR_ERROR,
  REQUEST_SAVE_CUSTOM_BOOKING_COLOR, SAVE_CUSTOM_BOOKING_COLOR_SUCCESS, SAVE_CUSTOM_BOOKING_COLOR_ERROR,
} from '../../../reducers/actionType'

const ConditionContainer = styled.div`
  display: flex;
  padding: 1em;
  background-color: rgb(241, 243, 245);
  margin-bottom: 1em;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 1em;
  &:last-child {
    margin-bottom: 0;
  }
`;

const ConditionItemDiv = styled.div`
  display: flex;
  width: 28%;
  padding-right: 1em;
`;

const StyledOutlineButton = styled(Button)`  
  margin-right: 1em;
`;

const CustomBookingColorSection = () => {

  const { state, dispatch } = useContext(AppReducerContext);

  const [conditionSettings, setConditionSettings] = useState([
      [
        {
          color: '#6389ea',
          value: 'and',
          content: [
            {
              condition_key: BOOKING_COLOR_CONDITION_KEYS[0].condition_key.value, 
              condition_type: BOOKING_COLOR_CONDITION_KEYS[0].condition_types[0].value,
              condition_value: ""
            }
          ]
        }
      ]
  ])

  useEffect(() => {
    const getCustomBookingColorInfo = async () => {
      try {
        dispatch({ type: REQUEST_GET_CUSTOM_BOOKING_COLOR })
        // const res = await axios.get('/custom-booking-color')
        // dispatch({ 
        //   type: GET_CUSTOM_BOOKING_COLOR_SUCCESS,
        //   payload: res.data.custom
        // })
      } catch {
        dispatch({ type: GET_CUSTOM_BOOKING_COLOR_ERROR })
      }
    }
    // getCustomBookingColorInfo();
  }, [])

  const addCondition = () => {    
    setConditionSettings([
      ...conditionSettings,
      [
        {
          color: '#6389ea',
          value: 'and',
          content: [
            {
              condition_key: BOOKING_COLOR_CONDITION_KEYS[0].condition_key.value, 
              condition_type: BOOKING_COLOR_CONDITION_KEYS[0].condition_types[0].value,
              condition_value: ""
            }
          ]
        }
      ]
    ])
  }

  const getInitialConditionType = (condition_key) => {
    const filterOne = BOOKING_COLOR_CONDITION_KEYS.filter(item => item.condition_key.value === condition_key)
    if (filterOne.length > 0)
      return filterOne[0].condition_types[0].value;
    else return "";
  }

  const getInitialConditionValue = (condition_key) => {
    const filterOne = BOOKING_COLOR_CONDITION_KEYS.filter(item => item.condition_key.value === condition_key)
    if (filterOne.length > 0)
      return filterOne[0].condition_values[0].value;
    else return "";
  }

  const getConditionKeyValues = () => {
    return BOOKING_COLOR_CONDITION_KEYS.map(item => {
      return item.condition_key.value
    })
  }

  const getConditionKeyLabel = (condition_key) => {
    const filterOne = BOOKING_COLOR_CONDITION_KEYS.filter(item => item.condition_key.value == condition_key)
    if (filterOne.length > 0)
      return filterOne[0].condition_key.label
    return ""
  }
  
  const handleChangeContionKey = (condition_key, nKey, nKeyTwo, nIndex) => {    
    const newOne = [ ...conditionSettings];
    if( newOne[nKey][nKeyTwo].content[nIndex].condition_key === condition_key)
      return;
    newOne[nKey][nKeyTwo].content[nIndex].condition_key = condition_key;    
    newOne[nKey][nKeyTwo].content[nIndex].condition_type = getInitialConditionType(condition_key)
    if (condition_key === 'payment_status')
      newOne[nKey][nKeyTwo].content[nIndex].condition_value = getInitialConditionValue(condition_key)
    else 
      newOne[nKey][nKeyTwo].content[nIndex].condition_value = ""
      
    setConditionSettings([ ...newOne ])
  }

  const getConditionTypeValues = (condition_key) => {
    const filterOne = BOOKING_COLOR_CONDITION_KEYS.filter(item => item.condition_key.value === condition_key)
    if (filterOne.length > 0)
      return filterOne[0].condition_types.map(itemOne => itemOne.value)
    return []
  }

  const getConditionTypeLabel = (condition_key, condition_type) => {
    const filterOne = BOOKING_COLOR_CONDITION_KEYS.filter(item => item.condition_key.value === condition_key)
    if (filterOne.length > 0) {
      const filterTwo = filterOne[0].condition_types.filter(itemOne => itemOne.value === condition_type)
      if (filterTwo.length > 0)
        return filterTwo[0].label
      else return ""
    } else
      return ""
  }

  const handleChangeConditionTypes = (condition_type, nKey, nKeyTwo, nIndex) => {
    const newOne = [ ...conditionSettings];
    newOne[nKey][nKeyTwo].content[nIndex].condition_type = condition_type;
    setConditionSettings([ ...newOne ])
  }

  const getConditionValuesValue = (condition_key) => {
    const filterOne = BOOKING_COLOR_CONDITION_KEYS.filter(item => item.condition_key.value === condition_key)
    if (filterOne.length > 0)
      return filterOne[0].condition_values.map(itemOne => itemOne.value)
    return []
  }

  const getConditionValueLabel = (condition_key, condition_value) => {
    const filterOne = BOOKING_COLOR_CONDITION_KEYS.filter(item => item.condition_key.value === condition_key)
    if (filterOne.length > 0) {
      const filterTwo = filterOne[0].condition_values.filter(itemOne => itemOne.value === condition_value)
      if (filterTwo.length > 0)
        return filterTwo[0].label
      else return ""
    } else 
      return ""
  }

  const handleChnageConditionValue = (value, nKey, nKeyTwo, nIndex) => {
    const newOne = [...conditionSettings];
    if (newOne[nKey][nKeyTwo].content[nIndex].condition_value === value)
      return;
      newOne[nKey][nKeyTwo].content[nIndex].condition_value = value;
    setConditionSettings([ ...newOne ])
  }

  const handleClickAdd = (nKey, nKeyTwo) => {
    const newOne = [...conditionSettings]
    newOne[nKey][nKeyTwo].content.push({
      condition_key: BOOKING_COLOR_CONDITION_KEYS[0].condition_key.value, 
      condition_type: BOOKING_COLOR_CONDITION_KEYS[0].condition_types[0].value,
      condition_value: ""
    })
    setConditionSettings([ ...newOne ])
  }

  const handleClickOR = (nKey) => {
    debugger;
  }

  return (
    <div>
      {/* <SpinnerContainer loading={state.customBookingColor.loading.toString()} /> */}
      <P2 color="grey">Add a custom colour to your booking Calendar</P2>
      {
        conditionSettings.map((itemOne, nKey) => {
          return <ConditionContainer key={nKey}>
            {
              <React.Fragment>
                {
                  itemOne.map((itemTwo, nKeyTwo) => {
                    return <React.Fragment key={nKeyTwo}>
                        {
                          itemTwo.content.map((item, nIndex) => {
                            return <Row key={nIndex}>
                              <ConditionItemDiv>
                                <TablePicker 
                                  label=""
                                  options={getConditionKeyValues()}
                                  style={{width: '100%'}}
                                  selectedOption={item.condition_key}                
                                  displayTransformer={
                                    option => { return getConditionKeyLabel(option) }
                                  }
                                  onOptionSelected={condition_key => {handleChangeContionKey(condition_key, nKey, nKeyTwo, nIndex)}}
                                />
                              </ConditionItemDiv>
                              <ConditionItemDiv>
                                <TablePicker 
                                  label=""
                                  options={getConditionTypeValues(item.condition_key)}
                                  style={{width: '100%'}}
                                  selectedOption={item.condition_type}                
                                  displayTransformer={
                                    option => { return getConditionTypeLabel(item.condition_key, option) }
                                  }
                                  onOptionSelected={condition_type => {handleChangeConditionTypes(condition_type, nKey, nKeyTwo, nIndex)}}
                                />
                              </ConditionItemDiv>
                              <ConditionItemDiv>
                                {
                                  item.condition_key === 'title' && (
                                    <TableEditableValue 
                                      label=""
                                      value={item.condition_value}
                                      style={{width: '100%'}}
                                      onChange={value => handleChnageConditionValue(value, nKey, nKeyTwo, nIndex)}
                                    />
                                  )
                                }
                                {
                                  item.condition_key === 'payment_status' && (
                                    <TablePicker
                                      label=""
                                      options={getConditionValuesValue(item.condition_key)}
                                      displayTransformer={
                                        option => { return getConditionValueLabel(item.condition_key, option)}
                                      }
                                      selectedOption={item.condition_value}
                                      style={{width: '100%'}}
                                      onOptionSelected={value => handleChnageConditionValue(value, nKey, nKeyTwo, nIndex)}
                                    />
                                  )
                                }
                              </ConditionItemDiv>
                            </Row>
                          })
                        }
                        <Row>
                          <StyledOutlineButton                
                            outline
                            onClick={() => handleClickAdd(nKey, nKeyTwo)}
                            iconComponent={() => <AddGlyph fill={colors.grey} />}        
                          >
                            And
                          </StyledOutlineButton>
                          <StyledOutlineButton                
                            outline
                            onClick={() => handleClickOR(nKey)}
                            iconComponent={() => <AddGlyph fill={colors.grey} />}        
                          >
                            Or
                          </StyledOutlineButton>
                        </Row>
                      </React.Fragment>                    
                  })
                }
              </React.Fragment>
            }  
          </ConditionContainer>          
        })
      }
            
      <Row>
        <Button
          primary
          onClick={addCondition}
          iconComponent={() => <AddGlyph fill={colors.white} />}        
        >
          Add a condition
        </Button>
      </Row>
    </div>
  )
}

export default CustomBookingColorSection;