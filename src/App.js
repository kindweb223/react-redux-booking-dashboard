import React, { useState, useReducer, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";
import axios from 'axios';

import RoutesTree from "./routing/RoutesTree";
import CalendarPage from "./pages/CalendarPage";
import Sidebar from "./components/layout/Sidebar";
import LayoutWrapper from "./components/layout/LayoutWrapper";
import LayoutSection from "./components/layout/LayoutSection";
import CalendarContext from "./contexts/CalendarContext";
import {
  AppReducerContext,
  reducer,
  initialState
} from "./contexts/AppReducerContext";

import setAuthToken from './utils/setAuthToken';

axios.defaults.baseURL = 'https://justvenue.herokuapp.com/v1';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = props => {
  const [calendarExpanded, setCalendarExpanded] = useState(false);
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
        <CalendarContext.Provider
          value={{ calendarExpanded, setCalendarExpanded }}
        >
          <Router>
            {state.auth.isAuthenticated && <Sidebar />}
            <LayoutWrapper>
              <LayoutSection bgColor="lightest" fullWidth>
                <Switch>
                  <Route path="/" exact component={CalendarPage} />      
                  <Route component={RoutesTree} />
                </Switch>
              </LayoutSection>
            </LayoutWrapper>
          </Router>
        </CalendarContext.Provider>
      </AppReducerContext.Provider>
    </>
  );
};

export default App;
