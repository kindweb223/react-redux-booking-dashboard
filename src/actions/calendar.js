import {
  REQUEST_SAVE_CALENDAR_SETTING,
  SAVE_CALENDAR_SETTING_ERROR,
  SET_CALENDAR_SETTING_DATA,
} from '../reducers/actionType'

import axios from 'axios'

export const setCalendarSettingAction = (dispatch, calendarSetting) =>  {
  dispatch({
    type: SET_CALENDAR_SETTING_DATA,
    payload: calendarSetting,
  })        
}

export const saveCalendarSettingAction = (dispatch, calendarSetting) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  try {    
    if (calendarSetting.id) {
      axios.put(
        `/calendarsetting/${calendarSetting.id}`, 
        {            
          viewExpand: calendarSetting.viewExpand,
          viewMode: calendarSetting.viewMode,
          selectedDate: calendarSetting.selectedDate,
        },
        config,
      ).then(res => {
        dispatch({
          type: SET_CALENDAR_SETTING_DATA,
          payload: {
            ...calendarSetting,
            selectedDate: new Date(calendarSetting.selectedDate),
            loading: false,
          }
        })
      })      
    } else {
      axios.post(
        '/calendarsetting', 
        {
          viewExpand: calendarSetting.viewExpand,
          viewMode: calendarSetting.viewMode,
          selectedDate: calendarSetting.selectedDate
        }, 
        config
      ).then(res => {
        dispatch({
          type: SET_CALENDAR_SETTING_DATA,
          payload: {
            ...calendarSetting,
            id: res.data.calendarSetting.id,
            loading: false,
            selectedDate: new Date(calendarSetting.selectedDate),
          }
        })
      })
    }
  } catch (err) {
    dispatch({ type: SAVE_CALENDAR_SETTING_ERROR })
  }
}
