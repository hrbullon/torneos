import React from 'react';
import { BrowserRouter as Router, Switch,Route } from "react-router-dom";

import Login from '../app/login/Login';
import { MainRouter } from './MainRouter';
import { PrivateRoute } from "./PrivateRoute";
  
export const  AppRouter = () => {

    return (
      <Router>
          <Switch>
            <Route path="/auth/login" component={Login}/>
            <PrivateRoute 
                path="/" 
                component={ MainRouter } 
                isAuthenticated={ (localStorage.getItem("logged")==="true")? true : false }
            />
          </Switch>
      </Router>
    );
}  
