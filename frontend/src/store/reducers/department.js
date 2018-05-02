/* Department reducer */

import * as actionTypes from '../actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    departments: null,
    error: false
};

const setDepartments = (state, action) => {
    return updateObject(state, { departments: action.departments });
};

const fetchIngredientsFailed = (state, action) => {
    return updateObject(state, { error: true });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.R_SET_DEPARTMENTS: return setDepartments(state, action);
        case actionTypes.R_FETCH_DEPARTMENTS_FAILED: return fetchIngredientsFailed(state, action);
        default: return state;
    }
};

export default reducer;