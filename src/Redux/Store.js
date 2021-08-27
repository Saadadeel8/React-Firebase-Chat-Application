import { createStore } from 'redux';
import { compose, createStore, applyMiddleware } from 'redux'


const loggerMiddleware = require('redux-logger');
const middleware = [loggerMiddleware.createLogger()];
const store = createStore(compose(applyMiddleware(...middleware)));
const store = createStore();
export default store;
