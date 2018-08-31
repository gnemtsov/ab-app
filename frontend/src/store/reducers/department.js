/* Department reducer */

import * as actionTypes from '../actionTypes';

const initialState = {
    departments: null,
    filter: null,
    error: false
};

const setDepartments = (state, action) => {
    return {...state, departments: action.departments };
};

const setFilter = (state, action) => {
	console.log('setFilter', action);
	return { ...state, filter: action.filter };
}

const fetchIngredientsFailed = (state, action) => {
    return { ...state, error: true };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.R_SET_DEPARTMENTS: return setDepartments(state, action);
        case actionTypes.R_SET_DEPARTMENTS_FILTER: return setFilter(state, action);
        case actionTypes.R_FETCH_DEPARTMENTS_FAILED: return fetchIngredientsFailed(state, action);
        default: return state;
    }
};

export default reducer;
