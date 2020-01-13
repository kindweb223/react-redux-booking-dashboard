import setAuthToken from "../utils/setAuthToken";

import {
  REQUEST_SAVE_PAYMENT_INFORMATION,
  SAVE_PAYMENT_INFORMATION_SUCCESS,
  SAVE_PAYMENT_INFORMATION_ERROR,
  STRIPE_CONNECTION_SUCCESS,
  GET_LOGIN_SUCCESS,
  GET_LOGIN_ERROR,
  GET_USER_SUCCESS,
  AUTH_ERROR,
  SET_LOGOUT
} from "./actionType";

function authReducer(state, action) {
  switch(action.type) {
    
    case GET_LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      setAuthToken(localStorage.token);
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: {...action.payload.user},
        token: action.payload.token,
      };
    case GET_LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: {...action.payload},
      }
    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: {
          ...action.payload.user
        },
        token: localStorage.token,
      }
    case AUTH_ERROR:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: { email: "", password: ""}
      }
    case SET_LOGOUT:
      localStorage.removeItem('token');
      setAuthToken(localStorage.token);
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: { email: "", password: ""}
      }    
    case REQUEST_SAVE_PAYMENT_INFORMATION:
      return {
        ...state,
        loadingPayment: true,
      }
    case SAVE_PAYMENT_INFORMATION_SUCCESS:
      return {
        ...state,
        loadingPayment: false,
        user: {
          ...state.user,
          stripe_public_key: action.public_key,
        }
      }
    case SAVE_PAYMENT_INFORMATION_ERROR:
      return {
        ...state,
        loadingPayment: false,
      }
    case STRIPE_CONNECTION_SUCCESS: {
      return  {
        ...state,
        user: {
          ...state.user,
          stripe_status: action.payload,
        }
      }
    }
    default:
      return state;
  }
}

export default authReducer;