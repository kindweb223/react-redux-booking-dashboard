function authReducer(state, action) {
  switch(action.type) {
    case "request_login_action":            
      return {
        ...state,
        loading: true,
        user: {...action.user},
        showInvalidMsg: false,
      };    
    case "get_login_success":
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: {...action.payload},
        showInvalidMsg: false,
      };
    case "get_login_error":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: {...action.payload},
        showInvalidMsg: true
      }
    case "user_load_success":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: {
          email: action.payload.email,
          password: action.payload.password
        }
      }
    case "auth_error":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        showInvalidMsg: false,
        user: { email: "", password: ""}
      }
    default:
      return state;
  }
}

export default authReducer;