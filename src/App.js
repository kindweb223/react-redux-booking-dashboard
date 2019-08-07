import React, { useState, useReducer } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CalendarPage from "./pages/CalendarPage";
import Sidebar from "./components/layout/Sidebar";
import LayoutWrapper from "./components/layout/LayoutWrapper";
import LayoutSection from "./components/layout/LayoutSection";
import BookingsPage from "./pages/BookingsPage";
import CustomersPage from "./pages/CustomersPage";
import SettingsPage from "./pages/SettingsPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import CalendarContext from "./contexts/CalendarContext";
import {
  AppReducerContext,
  reducer,
  initialState
} from "./contexts/AppReducerContext";

const App = props => {
  const [calendarExpanded, setCalendarExpanded] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

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
                  <Route path="/calendar" exact component={CalendarPage} />
                  <Route path="/login" exact component={LoginPage} />
                  <Route path="/bookings" exact component={BookingsPage} />
                  <Route path="/customers" exact component={CustomersPage} />
                  <Route path="/invoices" exact component={InvoicesPage} />
                  <Route path="/settings" exact component={SettingsPage} />
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
