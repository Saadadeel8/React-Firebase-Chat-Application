import React from 'react';
require('dotenv').config();
import firebase from "firebase/app";
import PropTypes from 'prop-types';
import Routes from './Components/Helpers/Routes'
import { useAuthState } from 'react-firebase-hooks/auth';
import './App.css';


function App() {
  const [user] = useAuthState(firebase.auth());
  console.log(user)
  return (
    <Routes user={user} />
  );
}

App.propTypes = {
  user: PropTypes.object
}
export default App;
