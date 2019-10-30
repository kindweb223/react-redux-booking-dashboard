import {
  REQUEST_GET_CUSTOM_BOOKING_COLOR, GET_CUSTOM_BOOKING_COLOR_SUCCESS, GET_CUSTOM_BOOKING_COLOR_ERROR,
  REQUEST_SAVE_CUSTOM_BOOKING_COLOR, SAVE_CUSTOM_BOOKING_COLOR_SUCCESS, SAVE_CUSTOM_BOOKING_COLOR_ERROR,
} from "./actionType";

function customBookingColorReducer(state = {}, action) {  
  switch (action.type) {    
    case REQUEST_GET_CUSTOM_BOOKING_COLOR: 
      return {
        ...state,
        loadingCustomers: true,
      }
    case GET_CUSTOM_BOOKING_COLOR_SUCCESS:
      return {
        ...state,
        loadingCustomers: false,
      }
    case GET_CUSTOM_BOOKING_COLOR_ERROR:
      return {
        ...state,
        loadingCustomers: false,
      }
    default:
      return state;
  }
}

export default customBookingColorReducer;
