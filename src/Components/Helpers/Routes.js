import React from 'react'
import Login from '../../Components/Login'
import Signup from '../../Components/Signup'
import ChatPreview from '../../Components/ChatPreview'
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";

function Routes(user) {
    return (
            <Router>
              <div className="App">
                <Switch>
                  <Route exact path="/" component={Signup}/>
                  <Route exact path="/Login" component={Login}/>
                  {user.uid?
                  <Route exact path="/ChatPreview" component={ChatPreview}/> : <Route exact path="/Login" component={Login}/>}
                </Switch>
              </div>
            </Router>
    )
}
export default Routes
