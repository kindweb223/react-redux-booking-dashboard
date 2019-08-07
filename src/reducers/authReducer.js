function authReducer(state, action) {
  switch(action.type) {
    case "request_login_action":            
      return {
        ...state,
        loading: true,
        user: {...action.user}
      };    
    case "get_login_result":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
      };
    case "set_user_email":
      return {
        ...state,
        user: {
          ...state.user, email: action.email,
        }
      };
    case "set_user_password":
      return {
        ...state,
        user: {
          ...state.user, email: action.password,
        }
      };
    default:
      return state;
  }
}

export default authReducer;