import * as actionTypes from '../actionTypes';

const initialState = {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    login: null,
    name: null,
    timezone: null,
    iat: null,
    exp: null,
    sub: null,
    error: null,
    loading: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.R_LOGIN_START:
            return {
                ...state,
                error: null,
                loading: true
            }

        case actionTypes.R_LOGIN_FAIL:
            return {
                ...state,
                error: action.error,
                loading: false
            }

        case actionTypes.R_LOGIN_SUCCESS:
            return {
                ...state,
                ...action.tokens,
                ...action.tokenData,
                isAuthenticated: true,
                error: null,
                loading: false
            }

        case actionTypes.R_LOGOUT:
            return {
                ...state,
                tokens: null,
                isAuthenticated: false
            }

        default:
            return state;
    }
};

export default reducer;