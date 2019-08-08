import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import PrivateRoutesTree from './PrivateRoutesTree';
import PrivateRoute from './PrivateRoute';
import LoginPage from '../pages/LoginPage';

const Routes = () => {
  return (
    <Fragment>
      <Switch>
        <Route exact path='/login' component={LoginPage} />
        <PrivateRoute component={PrivateRoutesTree} />
      </Switch>
    </Fragment>
  );
};

export default Routes;
