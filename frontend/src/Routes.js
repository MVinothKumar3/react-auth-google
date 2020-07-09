import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Login from './Login';
import Welcome from './Welcome';

const Routes = () => (
  <BrowserRouter >
      <Switch>
          <Route exact path="/" component={Welcome}/>
          <Route exact path="/login" component={Login}/>
      </Switch>
  </BrowserRouter>
);

export default Routes;