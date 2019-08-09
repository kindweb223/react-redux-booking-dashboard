import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AppReducerContext } from "../contexts/AppReducerContext";


const PrivateRoute = ({
  component: Component,
  ...rest
}) => {


  const { state } = useContext(AppReducerContext);
  const { isAuthenticated, loading } = state.auth;

  return (
    <Route
    {...rest}
    render={props =>
      !isAuthenticated && !loading ? (
        <Redirect to='/login' />
      ) : (
        <Component {...props} />
      )
    }
  />
  )
}  

export default PrivateRoute;
