/************auth***************/
//reducer
export const R_LOGIN_SUCCESS = 'R_LOGIN_SUCCESS';
export const R_LOGOUT = 'R_LOGOUT';
//saga
export const S_LOGIN = 'S_LOGIN';
export const S_LOGGEDIN = 'S_LOGGEDIN';
export const S_LOGOUT = 'S_LOGOUT';
export const S_TRY_AUTO_SIGNIN = 'S_TRY_AUTO_SIGNIN';
export const S_REFRESH_TOKEN = 'S_REFRESH_TOKEN';

/************departments***************/
//reducer
export const R_SET_DEPARTMENTS = 'R_SET_DEPARTMENTS';
export const R_FETCH_DEPARTMENTS_FAILED = 'R_FETCH_DEPARTMENTS_FAILED';
//saga
export const S_INIT_DEPARTMENTS = 'S_INIT_DEPARTMENTS';