import React from "react";
import { bookingStates } from "../models/bookingStates";
import { bookings } from "../models/bookings";
import bookingsReducer from "../reducers/bookingsReducer";
import settingsReducer from "../reducers/settingsReducer";
import customersReducer from "../reducers/customersReducer";
import authReducer from "../reducers/authReducer";
import { customers } from "../models/customers";

const AppReducerContext = React.createContext(null);

const initialState = {
  bookings: bookings,
  settings: {
    // company_name: "JustVenue LTD",
    // vat_id: "123457678",
    // street: "Regent Street",
    // city: "London",
    // post_code: "123",
    // phone: "+00 11111111",
    // currency: "GBP",
    // defaultVatRateText: "22",
    // defaultVatRate: 22,
    // bookingStatuses: bookingStates,
    // venues: venues
    company_name: "",
    vat_id: "",
    street: "",
    city: "",
    post_code: "",
    phone: "",
    currency: "",
    defaultVatRateText: "",
    defaultVatRate: "",
    bookingStatuses: bookingStates,
    venues: [],
    loading: false,
  },
  customers: customers,
  auth: {
    isAuthenticated: false,
    showInvalidMsg: false,
    loading: true,
    user: {
      email: "",
      password: ""
    },
    token: localStorage.getItem('token'),
  },
};

const reducer = combineReducers({
  settings: settingsReducer,
  bookings: bookingsReducer,
  customers: customersReducer,
  auth: authReducer,
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

export { AppReducerContext, statusesNameAndColors, reducer, initialState };
