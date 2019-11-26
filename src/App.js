import React, { useState, useReducer, useEffect } from "react";
import * as Sentry from '@sentry/browser';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from 'axios';

import RoutesTree from "./routing/RoutesTree";
import Sidebar from "./components/layout/Sidebar";
import LayoutWrapper from "./components/layout/LayoutWrapper";
import LayoutSection from "./components/layout/LayoutSection";
import {
  AppReducerContext,
  reducer,
  initialState
} from "./contexts/AppReducerContext";
import setAuthToken from './utils/setAuthToken';
import LoginPage from "./pages/LoginPage";

import CONFIG from './config';

// Sentry.init({dsn: CONFIG.SENTRY_DSN});
axios.defaults.baseURL = CONFIG.API_URL;

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {

    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    const getUser = async () => {      
      try {
        const res = await axios.get('/auth/me');
        dispatch({
          type: 'user_load_success',
          payload: res.data
        })
      } catch (err) {
        dispatch({
          type: 'auth_error'
        })
      }
    }
    
    getUser();          

  }, [])

  return (
    <>
      <AppReducerContext.Provider value={{ state, dispatch }}>
        <Router>
          {state.auth.isAuthenticated && <Sidebar />}
          <LayoutWrapper>
            <LayoutSection bgColor="lightest" fullWidth>
              <Switch>
                <Route path="/" exact component={LoginPage} />      
                <Route component={RoutesTree} />
              </Switch>
            </LayoutSection>
          </LayoutWrapper>
        </Router>
      </AppReducerContext.Provider>
    </>
  );
};

export default App;
