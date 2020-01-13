import {
  REQUEST_GET_CUSTOMERS,
  GET_CUSTOMERS_SUCCESS,
  GET_CUSTOMERS_ERROR,
  REQUEST_ADD_CUSTOMER,
  GET_ADD_CUSTOMER_SUCCESS,
  GET_ADD_CUSTOMER_ERROR,
  REQUEST_UPDATE_CUSTOMER,
  GET_UPDATE_CUSTOMER_SUCCESS,
  GET_UPDATE_CUSTOMER_ERROR,
  REQUEST_DELETE_CUSTOMER,
  GET_DELETE_CUSTOMER_SUCCESS,
  GET_DELETE_CUSTOMER_ERROR,
} from "./actionType";

function customersReducer(state = {}, action) {
  switch (action.type) {
    case "delete_customer": {
      const newState = Array.from(state);
      const index = newState.findIndex(customer => customer.id === action.id);
      if (index !== -1) {
        newState.splice(index, 1);
      }
      return newState;
    }
    case "append_customer": {
      const newState = Array.from(state);
      newState.push(action.customer);
      return newState;
    }
    case REQUEST_GET_CUSTOMERS: 
      return {
        ...state,
        loadingCustomers: true,
      };
    case GET_CUSTOMERS_SUCCESS:
      return {
        ...state,
        loadingCustomers: false,
        customers: [ ...action.payload ]
      };
    case GET_CUSTOMERS_ERROR:
      return {
        ...state,
        loadingCustomers: false,
        customers: []
      };
    case REQUEST_ADD_CUSTOMER:
      return {
        ...state,
        loadingCustomers: true,        
      };
    case GET_ADD_CUSTOMER_SUCCESS:
      return {
        ...state,
        loadingCustomers: false,   
        customers: [...state.customers, action.payload]     
      };
    case GET_ADD_CUSTOMER_ERROR:
      return {
        ...state,
        loadingCustomers: false,
      };
    case REQUEST_UPDATE_CUSTOMER:
      return {
        ...state,
        loadingCustomers: false,        
      };
    case GET_UPDATE_CUSTOMER_SUCCESS:    
      const newCustomers = state.customers.map(item => {
        if (item.id === action.payload.id)
          return action.payload;
        else return item;
      });
      return {
        ...state,
        loadingCustomers: false,
        customers: [ ...newCustomers ],
      };
    case GET_UPDATE_CUSTOMER_ERROR:
      return {
        ...state,
        loadingCustomers: false,        
      };
    case REQUEST_DELETE_CUSTOMER:
      return {
        ...state,
        loadingCustomers: true,
      };
    case GET_DELETE_CUSTOMER_SUCCESS:
      return {
        ...state,
        loadingCustomers: false,
        customers: state.customers.filter(item => item.id !== action.payload)
      };
    case GET_DELETE_CUSTOMER_ERROR: 
      return {
        ...state,
        loadingCustomers: false,
      };
    default:
      return state;
  }
};

export default customersReducer;
