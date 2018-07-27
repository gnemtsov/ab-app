import { put } from "redux-saga/effects";
import { delay } from 'redux-saga';
import axios from 'axios';

import * as actionTypes from "../actionTypes";

const parseToken = (accessToken) => {
    let base64Url = accessToken.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const tokenData = JSON.parse(atob(base64));
    return tokenData;
}

export function* logIn(action) {
    console.log('Saga, Auth, logIn: logging in..');
    const tokens = action.tokens;
    const tokenData = parseToken(tokens.accessToken);
    yield put({
        type: actionTypes.S_LOGGEDIN,
        tokens: tokens,
        tokenData: tokenData
    });
}

export function* loggedIn(action) {
    console.log('Saga, Auth, loggedIn: updating tokens..');

    localStorage.setItem('tokens', JSON.stringify(action.tokens));
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + action.tokens.accessToken;

    yield put({
        type: actionTypes.R_LOGIN_SUCCESS,
        tokens: action.tokens,
        tokenData: action.tokenData
    });

    yield delay(50 * 60 * 1000);
    console.log(`Saga, Auth, loggedIn: dispatched refresh action`);
    yield put({
        type: actionTypes.S_REFRESH_TOKEN,
        sub: action.tokenData.sub,
        refreshToken: action.tokens.refreshToken
    });
}


export function* tryAutoSignIn(action) {
    const tokens = JSON.parse(localStorage.getItem('tokens'));

    if (tokens && Object.keys(tokens).length > 0) {
        const tokenData = parseToken(tokens.accessToken);

        if (tokenData.exp > Math.floor(Date.now() / 1000)) {
            console.log('Saga, Auth, autoSignIn: access token hasn\'t expired, logging in..');
            yield put({
                type: actionTypes.S_LOGGEDIN,
                tokens: tokens,
                tokenData: tokenData
            });
        } else {
            console.log('Saga, Auth, autoSignIn: access token expired, trying to refresh..');
            yield put({
                type: actionTypes.S_REFRESH_TOKEN,
                sub: tokenData.sub,
                refreshToken: tokens.refreshToken
            });

        }
    } else {
        console.log('Saga, Auth, autoSignIn: no tokens found in local storage');
    }
}

export function* refreshToken(action) {
    const authData = {
        sub: action.sub,
        refreshToken: action.refreshToken
    };

    try {
        const response = yield axios.post('/auth/token', authData);
        const tokens = response.data;
        const tokenData = parseToken(tokens.accessToken);
        console.log(`Saga, Auth, refreshToken: access token refreshed. Logging in..`);
        yield put({
            type: actionTypes.S_LOGGEDIN,
            tokens: tokens,
            tokenData: tokenData
        });
    } catch (error) {
        console.log('Saga, Auth, refreshToken: error while refreshing token. Logging out..');
        yield put({
            type: actionTypes.S_LOGOUT
        });
    }
}


export function* logOut(action) {
    console.log('Saga, Auth, logOut: logging out...');
    localStorage.removeItem('tokens');
    delete axios.defaults.headers.common['Authorization'];
    yield put({
        type: actionTypes.R_LOGOUT
    });
}