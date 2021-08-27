import React from 'react'
import Login from '../../Components/Login'
import Signup from '../../Components/Signup'
import ChatPreview from '../../Components/ChatPreview'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation
  } from "react-router-dom";
import userEvent from '@testing-library/user-event';

function Routes() {
    return (
        
            <Router>
            <div className="App">
            <Switch>
            <Route exact path="/" component={Signup}/>
            <Route exact path="/Login" component={Login}/>
            {user.uid?
            <Route exact path="/ChatPreview" component={ChatPreview}/> : <Route exact path="/login" component={Login}/>}
            </Switch>
            </div>
            </Router>
        
    )
}

export default Routes
