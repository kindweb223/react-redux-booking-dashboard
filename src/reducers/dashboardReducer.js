import {
  SET_RECENT_SALES_PERIOD,
  SET_UPCOMING_BOOKING_PERIOD,
} from './actionType'

function dashboardReducer(state = {}, action) {
  switch (action.type) {
    case SET_RECENT_SALES_PERIOD:
      return {
        ...state,
        recentSalesPeriod: action.payload,
      }
    case SET_UPCOMING_BOOKING_PERIOD:
      return {
        ...state,
        upcomingBookingPeriod: action.payload,
      }
    default:
      return state;
  }
}

export default dashboardReducer;
