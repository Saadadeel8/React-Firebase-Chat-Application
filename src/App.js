import React from 'react';
require('dotenv').config();
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './Components/Services/base'
import Routes from './Components/Helpers/Routes'
import { useAuthState } from 'react-firebase-hooks/auth';
import './App.css';


function App() {
  const [user] = useAuthState(firebase.auth());
  return (
    <Routes user={user} />
  );
}

export default App;
