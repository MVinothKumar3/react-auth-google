import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
//import axios from 'axios';

import Login from './Login';
import Dashboard from './Dashboard';
import Home from './Home';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import { getToken, removeUserSession, setUserSession } from './Common';

function App() {
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }else{
      setAuthLoading(false);
    }
  }, []);

  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>
  }

  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <div className="header">
            <NavLink exact activeClassName="active" to="/">Home</NavLink>
            <NavLink activeClassName="active" to="/login">Login</NavLink>
            <NavLink activeClassName="active" to="/dashboard">Dashboard</NavLink>
          </div>
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <PublicRoute path="/login" component={Login} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;