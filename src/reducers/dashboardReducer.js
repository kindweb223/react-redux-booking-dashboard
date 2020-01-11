import {
  SET_RECENT_BOOKINGS_PERIOD,
  SET_UPCOMING_BOOKINGS_PERIOD,
} from './actionType'

function dashboardReducer(state = {}, action) {
  switch (action.type) {
    case SET_RECENT_BOOKINGS_PERIOD:
      return {
        ...state,
        recentBookingsPeriod: action.payload,
      }
    case SET_UPCOMING_BOOKINGS_PERIOD:
      return {
        ...state,
        upcomingBookingPeriod: action.payload,
      }
    default:
      return state;
  }
}

export default dashboardReducer;
