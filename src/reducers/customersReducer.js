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
    default:
      return state;
  }
}

export default customersReducer;
