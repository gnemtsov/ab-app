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
    sub: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.R_LOGIN_SUCCESS:
            return {
                ...state,
                ...action.tokens,
                ...action.tokenData,
                isAuthenticated: true
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