import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";

import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import departmentReducer from "./store/reducers/department";
import authReducer from "./store/reducers/auth";
import { watchAuth, watchDepartments } from "./store/sagas";

import axios from 'axios';

axios.defaults.baseURL = 
    process.env.NODE_ENV === "development" 
        ? process.env.REACT_APP_LOCAL_APIGATEWAY_URL
        : 'https://kg0mslaalb.execute-api.eu-west-1.amazonaws.com/prod';

const composeEnhancers =
    process.env.NODE_ENV === "development"
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : null || compose;

const rootReducer = combineReducers({
    departments: departmentReducer,
    auth: authReducer
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(watchAuth);
sagaMiddleware.run(watchDepartments);

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();
