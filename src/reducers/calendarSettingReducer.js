import {
  GET_CALENDAR_SETTING_SUCCESS, GET_CALENDAR_SETTING_ERROR,
  CREATE_CALENDAR_SETTING_SUCCESS, CREATE_CALENDAR_SETTING_ERROR,
  UPDATE_CALENDAR_SETTING_SUCCESS,
  SET_CALENDAR_SETTING_DATA,
} from './actionType'

function calendarSettingReducer(state = {}, action) {  
  switch (action.type) {        
    case GET_CALENDAR_SETTING_SUCCESS:{
      if (action.payload) 
        return {
          ...state,
          ...action.payload,
        }
      else return { ...state }
    }    
    case CREATE_CALENDAR_SETTING_SUCCESS:
    case UPDATE_CALENDAR_SETTING_SUCCESS:
      return {
        ...state,
        ...action.payload,       
      }
    case GET_CALENDAR_SETTING_ERROR:
    case CREATE_CALENDAR_SETTING_ERROR:    
      return {
        ...state,
      }            
    case SET_CALENDAR_SETTING_DATA:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state;
  }
}

export default calendarSettingReducer;