import {
  REQUEST_GET_CALENDAR_CUSTOM_VIEW, GET_CALENDAR_CUSTOM_VIEW_SUCCESS, GET_CALENDAR_CUSTOM_VIEW_ERROR,
  REQUEST_CREATE_CALENDAR_CUSTOM_VIEW, CREATE_CALENDAR_CUSTOM_VIEW_SUCCESS, CREATE_CALENDAR_CUSTOM_VIEW_ERROR,
  REQUSET_UPDATE_CALENDAR_CUSTOM_VIEW, UPDATE_CALENDAR_CUSTOM_VIEW_SUCCESS, UPDATE_CALENDAR_CUSTOM_VIEW_ERROR,
  REQUEST_GET_USERS_ALL_SPACES, GET_USERS_ALL_SPACES_SUCCESS, GET_USERS_ALL_SPACES_ERROR,
  SET_CURRENT_CALENDAR_VIEW,
} from './actionType'

function calendarCustomViewReducer(state = {}, action) {  
  switch (action.type) {    
    case REQUEST_GET_CALENDAR_CUSTOM_VIEW: 
      return {
        ...state,
        loading: true,
      }
    case GET_CALENDAR_CUSTOM_VIEW_SUCCESS:
      const newOne = {
        id: action.payload.id ? action.payload.id : -1,
        views: action.payload.views ? [ ...JSON.parse(action.payload.views) ] : [],
      }
      return {
        ...state,
        loading: false,
        calendarViewData: { ...newOne }
      }
    case GET_CALENDAR_CUSTOM_VIEW_ERROR:
      return {
        ...state,
        loading: false,
      }
    case REQUEST_CREATE_CALENDAR_CUSTOM_VIEW:
      return {
        ...state,
        loading: true,
      }
    case CREATE_CALENDAR_CUSTOM_VIEW_SUCCESS:
      return {
        ...state,
        loading: false,  
        calendarViewData: { 
          id: action.payload.id,
          views: JSON.parse(action.payload.views)
         }
      }
    case CREATE_CALENDAR_CUSTOM_VIEW_ERROR:
      return {
        ...state,
        loading: false,
      }
    case REQUSET_UPDATE_CALENDAR_CUSTOM_VIEW:
      return {
        ...state,
        loading: true,        
      }
    case UPDATE_CALENDAR_CUSTOM_VIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        calendarViewData: {
          id: action.payload.id,
          views: JSON.parse(action.payload.views)
        }
      }
    case UPDATE_CALENDAR_CUSTOM_VIEW_ERROR:
      return {
        ...state,
        loading: false,
      }
    case REQUEST_GET_USERS_ALL_SPACES:
      return {
        ...state,
        loading: true,
      }
    case GET_USERS_ALL_SPACES_SUCCESS:
      return {
        ...state,
        loading: false,
        allSpaces: [ ...action.payload ],
      }
    case GET_USERS_ALL_SPACES_ERROR:
      return {
        ...state,
        loading: false
      }
    case SET_CURRENT_CALENDAR_VIEW:
      return {
        ...state,
        curView: action.payload,
      }
    default:
      return state;
  }
}

export default calendarCustomViewReducer;