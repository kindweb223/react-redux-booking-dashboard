import {
  REQUEST_GET_CUSTOM_BOOKING_COLOR, GET_CUSTOM_BOOKING_COLOR_SUCCESS, GET_CUSTOM_BOOKING_COLOR_ERROR,
} from "./actionType";

function customBookingColorReducer(state = {}, action) {  
  switch (action.type) {    
    case REQUEST_GET_CUSTOM_BOOKING_COLOR: 
      return {
        ...state,
        loading: true,
      }
    case GET_CUSTOM_BOOKING_COLOR_SUCCESS:
      return {
        ...state,
        loading: false,
        bookingColors: [ ...action.payload ],
      }
    case GET_CUSTOM_BOOKING_COLOR_ERROR:
      return {
        ...state,
        loading: false,
      }
    default:
      return state;
  }
}

export default customBookingColorReducer;
