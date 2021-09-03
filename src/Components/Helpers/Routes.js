/* eslint-disable react/prop-types */
import React from 'react';
import Login from '../../Components/Login';
import Signup from '../../Components/Signup';
import ChatPreview from '../../Components/ChatPreview';
import PropTypes from 'prop-types';
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";

const Routes = ({user}) => {

  return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Signup}/>
            <Route exact path="/Login" component={Login}/>
            {user?.uid ?
              <Route exact path="/ChatPreview" component={()=>ChatPreview({user})} /> : <Route exact path="/Login" component={Login}/>}
          </Switch>
        </div>
      </Router>
  )
}
Routes.propTypes = {
  user: PropTypes.object
}
export default Routes
