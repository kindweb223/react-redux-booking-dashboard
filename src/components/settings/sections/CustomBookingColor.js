import React, {useState, useContext, useEffect} from "react";
import useDebouncedCallback from "use-debounce/lib/useDebouncedCallback";
import axios from 'axios';
import styled from "styled-components";

import colors from "../../style/colors";
import AddGlyph from "../../../images/Glyphs/AddGlyph";
import removeSvg from "../../../images/ui/remove.svg";
import P2 from "../../typography/P2";
import Button from "../../buttons/Button";
import SpinnerContainer from "../../layout/Spinner";
import { TablePicker, TableEditableValue, TableDivider } from "../../tables/tables";
import SvgButton from "../../buttons/SvgButton";

import {
  AppReducerContext,
} from "../../../contexts/AppReducerContext";

import { BOOKING_COLOR_CONDITION_KEYS, BOOKING_COLORS } from '../../../constants';
import {
  REQUEST_GET_CUSTOM_BOOKING_COLOR, GET_CUSTOM_BOOKING_COLOR_SUCCESS, GET_CUSTOM_BOOKING_COLOR_ERROR,
} from '../../../reducers/actionType'

import '../../../css/settings.css'

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
  align-items: center;
  &:last-child {
    margin-bottom: 0;
  }
`;

const ConditionItemDiv = styled.div`
  display: flex;
  width: 30%;
  padding-right: 1em;
`;

const StyledOutlineButton = styled(Button)`  
  margin-right: 1em;
`;

const StyledTableDivider = styled.div`
  border-bottom: 1px solid #E6E8E9;  
  margin-bottom: 1em;
  width: 100%;
`;

const StyledColorSpan = styled.span`
  display: block;
  width: 14px;
  height: 14px;
  background-color:${props => props.color};
  border-radius: 2px;
  margin: 0 auto;
`

const StyledP2 = styled(P2)`
  margin: 0;
  line-height: 34px;
`;

const RemoveButton = styled(SvgButton)`
  margin-left: auto;
`;

const CustomBookingColorSection = () => {

  const { state, dispatch } = useContext(AppReducerContext);

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [conditionSettingId, setConditionSettingId] = useState(-1)
  const [conditionSettings, setConditionSettings] = useState([
    {        
      color: BOOKING_COLORS[0],
      content: [
        [
          {
            condition_key: BOOKING_COLOR_CONDITION_KEYS[0].condition_key.value, 
            condition_type: BOOKING_COLOR_CONDITION_KEYS[0].condition_types[0].value,
            condition_value: BOOKING_COLOR_CONDITION_KEYS[0].condition_values[0].value,
          }
        ]          
      ]
    }
  ])

  useEffect(() => {
    const getCustomBookingColorInfo = async () => {
      try {        
        const res = await axios.get('/bookingcolor')
        if (res.data.bookingColor) {
          setConditionSettingId(res.data.bookingColor.id)
          setConditionSettings(JSON.parse(res.data.bookingColor.color))
        }
        setLoading(false)
      } catch {

        setLoading(false)
      }
    }
    getCustomBookingColorInfo();
  }, [])

  const saveConditions = async (conditions) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      setSaving(true);
      let res;
      if (conditionSettingId === -1) {
        res = await axios.post('/bookingcolor', {color: JSON.stringify(conditions)}, config)
        setConditionSettingId(res.data.bookingColor.id)
      } else {
        res = await axios.put(`/bookingcolor/${conditionSettingId}`, {color: JSON.stringify(conditions)}, config)
      }
      setSaving(false);
    } catch (err) {
      setSaving(false);
    }
  }

  const addCondition = () => {
    const newOne = [
      ...conditionSettings,
      {
        color: BOOKING_COLORS[0],
        content: [
          [
            {
              condition_key: BOOKING_COLOR_CONDITION_KEYS[0].condition_key.value, 
              condition_type: BOOKING_COLOR_CONDITION_KEYS[0].condition_types[0].value,
              condition_value: BOOKING_COLOR_CONDITION_KEYS[0].condition_values[0].value,
            }
          ]          
        ]
      }
    ]
    setConditionSettings([ ...newOne ])
    saveConditions(newOne)
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
    if( newOne[nKey].content[nKeyTwo][nIndex].condition_key === condition_key)
      return;
    newOne[nKey].content[nKeyTwo][nIndex].condition_key = condition_key;    
    newOne[nKey].content[nKeyTwo][nIndex].condition_type = getInitialConditionType(condition_key)
    if (condition_key === 'payment_status')
      newOne[nKey].content[nKeyTwo][nIndex].condition_value = getInitialConditionValue(condition_key)
    else 
      newOne[nKey].content[nKeyTwo][nIndex].condition_value = ""
      
    setConditionSettings([ ...newOne ])
    saveConditions(newOne)
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
    newOne[nKey].content[nKeyTwo][nIndex].condition_type = condition_type;
    setConditionSettings([ ...newOne ])
    saveConditions(newOne)
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
    if (newOne[nKey].content[nKeyTwo][nIndex].condition_value === value)
      return;
      newOne[nKey].content[nKeyTwo][nIndex].condition_value = value;
    setConditionSettings([ ...newOne ])
    saveConditions(newOne)
  }

  const handleChangeConditionValueText = (value, nKey, nKeyTwo, nIndex) => {
    const newOne = [...conditionSettings];
    if (newOne[nKey].content[nKeyTwo][nIndex].condition_value === value)
      return;
    newOne[nKey].content[nKeyTwo][nIndex].condition_value = value;
    setConditionSettings([ ...newOne ])
  }

  const [debouncedChangeConditionValue] = useDebouncedCallback((value, nKey, nKeyTwo, nIndex) => {
    saveConditions(conditionSettings)
  }, 1000);

  const handleClickAdd = (nKey, nKeyTwo) => {
    const newOne = [...conditionSettings]
    newOne[nKey].content[nKeyTwo].push({
      condition_key: BOOKING_COLOR_CONDITION_KEYS[0].condition_key.value, 
      condition_type: BOOKING_COLOR_CONDITION_KEYS[0].condition_types[0].value,
      condition_value: BOOKING_COLOR_CONDITION_KEYS[0].condition_values[0].value,
    })
    setConditionSettings([ ...newOne ])
    saveConditions(newOne)
  }

  const handleClickOR = (nKey, nKeyTwo) => {
    const newOne = [ ...conditionSettings ]
    newOne[nKey].content.push(
      [
        {
          condition_key: BOOKING_COLOR_CONDITION_KEYS[0].condition_key.value, 
          condition_type: BOOKING_COLOR_CONDITION_KEYS[0].condition_types[0].value,
          condition_value: BOOKING_COLOR_CONDITION_KEYS[0].condition_values[0].value,
        }
      ]       
    )
    setConditionSettings([ ...newOne ])
    saveConditions(newOne)
  }

  const handleChangeBookingColor = (selColor, nKey) => {
    const newOne = [ ...conditionSettings ]
    if (conditionSettings[nKey].color === selColor)
      return
      newOne[nKey].color = selColor
    setConditionSettings([ ...newOne ])
    saveConditions(newOne)
  }

  const handleClickDeleteRow = (nKey, nKeyTwo, nIndex) => {
    const newOne = [ ...conditionSettings ]
    newOne[nKey].content[nKeyTwo].splice(nIndex, 1)
    if (newOne[nKey].content[nKeyTwo].length === 0)
      newOne[nKey].content.splice(nKeyTwo, 1)
    if (newOne[nKey].content.length === 0)
      newOne.splice(nKey, 1)
    setConditionSettings([ ...newOne ])
  }

  return (
    <div>
      <SpinnerContainer loading={loading.toString()} />
      <P2 color="grey">Add a custom colour to your booking Calendar</P2>
      {
        conditionSettings.map((itemOne, nKey) => {
          return <ConditionContainer key={nKey}>
            <Row>
              <StyledP2 color="grey">Use</StyledP2>
                <TablePicker                               
                  label=""
                  options={BOOKING_COLORS}
                  displayTransformer={
                    option => { return <StyledColorSpan key={option} color={option} /> }
                  }
                  style={{marginLeft: '0.3em', marginRight: '0.3em'}}
                  selectedOption={itemOne.color}
                  onOptionSelected={selColor => handleChangeBookingColor(selColor, nKey)}
                />
              <StyledP2 color="grey">when...</StyledP2>              
            </Row>
            {
              itemOne.content.map((itemTwo, nKeyTwo) => {
                return <React.Fragment key={"itemTwo" + nKeyTwo}>
                  {
                    nKeyTwo > 0 && <StyledP2>...or When</StyledP2>
                  }
                  {
                    itemTwo.map((item, nIndex) => {
                      return <Row key={"item"+nIndex}>
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
                                  onChange={value => {
                                    handleChangeConditionValueText(value, nKey, nKeyTwo, nIndex)
                                    debouncedChangeConditionValue(value, nKey, nKeyTwo, nIndex)
                                  }}
                                />
                              )
                            }
                            {
                              (item.condition_key === 'payment_status' || item.condition_key === 'slot_type') && (
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
                          <RemoveButton
                            size={20}
                            svg={removeSvg}
                            onClick={() => handleClickDeleteRow(nKey, nKeyTwo, nIndex)}
                          />
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
                    {
                      nKeyTwo === (itemOne.content.length - 1) && (
                        <StyledOutlineButton                
                          outline
                          onClick={() => handleClickOR(nKey)}
                          iconComponent={() => <AddGlyph fill={colors.grey} />}        
                        >
                          Or
                        </StyledOutlineButton>
                      )
                    }
                  </Row>
                  {
                    (nKeyTwo < (itemOne.content.length - 1)) && (
                      <StyledTableDivider />
                    )
                  }
                </React.Fragment> 
              })
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