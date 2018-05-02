import { takeEvery, all } from "redux-saga/effects";

import * as actionTypes from "../actionTypes";
import * as authSagas from "./auth";
import * as depSagas from "./department";

export function* watchAuth() {
  yield all([
    takeEvery(actionTypes.S_LOGIN, authSagas.logIn),
    takeEvery(actionTypes.S_LOGGEDIN, authSagas.loggedIn),
    takeEvery(actionTypes.S_TRY_AUTO_SIGNIN, authSagas.tryAutoSignIn),
    takeEvery(actionTypes.S_REFRESH_TOKEN, authSagas.refreshToken),
    takeEvery(actionTypes.S_LOGOUT, authSagas.logOut)
  ]);
}

export function* watchDepartments() {
  yield takeEvery(actionTypes.S_INIT_DEPARTMENTS, depSagas.initDepartaments);
}