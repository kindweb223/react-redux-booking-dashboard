import React from "react";
import bookingsReducer from "../reducers/bookingsReducer";
import settingsReducer from "../reducers/settingsReducer";
import customersReducer from "../reducers/customersReducer";
import authReducer from "../reducers/authReducer";
import customBookingColorReducer from "../reducers/customBookingColorReducer";
import calendarViewReducer from "../reducers/calendarCustomViewReducer";
import calendarSettingReducer from "../reducers/calendarSettingReducer";
const AppReducerContext = React.createContext(null);

const initialState = {
  bookings: {
    bookings:[],
    bookingStatus: [],
    loadBooking: false,
    loadBookingAction: false,
    quotes: [],
    loadingQuotes: false,
    loadingInvoice: false,
    invoices: [],
    owners: [],
  },
  settings: {
    companyLoading: false,
    companyInfo: {
      name: "",
      vatId: "",
      street: "",
      city: "",
      postCode: "",
      phone: "",
      currency: "",
      vatRate: "",
      logoImg: "",
    },
    bookingStatuses: [],
    enableBookingSection: true,
    bookingStatusLoading: false,
    bookingStatusActionLoading: false,

    venues: [],
    loading: false,
    selectedVenueSpaces: [],
    venuesLoading: false,
    venueActionLoading: false,
    spacesLoading: false,
    spaceActionLoading: false,

    payment: {      
      public_key: "",
    },
  },

  customers: {
    customers: [],
    loadingCustomers: false,
  },

  auth: {
    isAuthenticated: false,
    loading: true,
    user: {
      email: "",
      password: ""
    },
    token: localStorage.getItem('token'),
    loadingPayment: false,
  },

  customBookingColor: {
    loading: true,
    bookingColors: [],
  },

  calendarViews: {
    loading: true,
    calendarViewData: {},
    allSpaces: [],
    curView: 'spaces',
  },

  calendarSettings: {    
    loading: false,
    selectedDate: new Date(),
    viewMode: 'week',
    viewExpand: true
  }
};

const reducer = combineReducers({
  settings: settingsReducer,
  bookings: bookingsReducer,
  customers: customersReducer,
  auth: authReducer,
  customBookingColor: customBookingColorReducer,
  calendarViews: calendarViewReducer, 
  calendarSettings: calendarSettingReducer,
});

function combineReducers(reducers) {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
}

// state selectors

function statusesNameAndColors(state) {
  const statuses = state.settings.bookingStatuses.filter(
    s => (s.enabled === undefined || s.enabled === true) && s.name.length > 0
  );
  const bookingStatesNames = statuses.map(s => s.name);
  const bookingStatesColors = statuses.map(s => s.color || "grey");

  return [bookingStatesNames, bookingStatesColors];
}

const getStatuColor = (statusName) => {
  if (statusName === "Enquiry") {
    return "#EECB2D";
  } else if (statusName === "Proposal") {
    return "#F68F56";
  } else if (statusName === "Accepted") {
    return "#E92579";
  } else if (statusName === "Paid") {
    return  "#52DDC2";
  } else {
    return "grey";
  }
}

export { AppReducerContext, statusesNameAndColors, reducer, initialState, getStatuColor };
