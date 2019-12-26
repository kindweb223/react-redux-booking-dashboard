import setAuthToken from "../utils/setAuthToken";

import {
  REQUEST_SAVE_PAYMENT_INFORMATION,
  SAVE_PAYMENT_INFORMATION_SUCCESS,
  SAVE_PAYMENT_INFORMATION_ERROR,
  STRIPE_CONNECTION_SUCCESS,
} from "./actionType";

function authReducer(state, action) {
  switch(action.type) {
    
    case "get_login_success":
      localStorage.setItem('token', action.payload.token);
      setAuthToken(localStorage.token);
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: {...action.payload.user},
        token: action.payload.token,
      };
    case "get_login_error":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: {...action.payload},
      }
    case "user_load_success":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: {
          ...action.payload.user
        },
        token: localStorage.token,
      }
    case "auth_error":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: { email: "", password: ""}
      }
    case "set_logout":
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