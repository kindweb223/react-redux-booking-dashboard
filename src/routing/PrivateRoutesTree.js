import React from 'react';
import { Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import BookingsPage from "../pages/BookingsPage";
import CustomersPage from "../pages/CustomersPage";
import SettingsPage from "../pages/SettingsPage";
import InvoicesPage from "../pages/InvoicesPage";
import CalendarPage from "../pages/CalendarPage";
import CreateStripeAccount from "../pages/CreateStripeAccount";

const Routes = () => {

  return (
    <Switch>
      <PrivateRoute path="/calendar" exact component={CalendarPage} />
      <PrivateRoute path="/bookings" exact component={BookingsPage} />
      <PrivateRoute path="/customers" exact component={CustomersPage} />
      <PrivateRoute path="/invoices" exact component={InvoicesPage} />
      <PrivateRoute path="/settings" exact component={SettingsPage} />
      <PrivateRoute path="/create-stripe-account" exact component={CreateStripeAccount} />
    </Switch>
  );
};

export default Routes;
