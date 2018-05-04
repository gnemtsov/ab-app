import { put } from "redux-saga/effects";
import axios from 'axios';

import * as actionTypes from "../actionTypes";

export function* initDepartaments(action) {
    console.log('Saga, Deps, initDepartaments: loading departments');
    try {
        const deps = yield axios.get('/departments/list');

        yield put({
            type: actionTypes.R_SET_DEPARTMENTS,
            departments: deps.data
        });
    } catch (error) {
        yield put({
            type: actionTypes.R_FETCH_DEPARTMENTS_FAILED
        });
    }
}
