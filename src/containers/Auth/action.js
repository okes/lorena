/* @flow */

import type {
  Dispatch,
  GetState,
  ThunkAction,
  Reducer,
} from '../../types';

export const AUTH_ISOPEN = 'ISOPEN';
export const AUTH_LOGOUT = 'LOGOUT';
export const AUTH_LOGIN = 'LOGIN';
export const AUTH_SAVE_LOGIN = 'AUTH_SAVE_LOGIN';

const isLoggin = (state: Reducer): boolean => {
  const auth = state.auth;

  if (auth.signedIn === false) return false; // Preventing double fetching data

  return true;
};

export const login = (): ThunkAction =>
  (dispatch: Dispatch, getState: GetState) => {
    if (!isLoggin(getState())) {
      return dispatch({ type: AUTH_LOGIN });
    }

    /* istanbul ignore next */
    return null;
  };

export const savelogin = (_username: String, _password: String): ThunkAction =>
  (dispatch: Dispatch, getState: GetState) => {
    if (!isLoggin(getState())) {
      dispatch({ type: AUTH_SAVE_LOGIN, username: _username, password: _password });
    }

    return null;
  };

export const logout = (): ThunkAction =>
  (dispatch: Dispatch, getState: GetState) => {
    if (isLoggin(getState())) {
      dispatch({ type: AUTH_LOGOUT });
    }

    return null;
  };

const isIgual = (state: Reducer): boolean => {
  const auth = state.auth;

  if (auth.isopen === true) return true;

  return false;
};
// open modal login
export const openLogin = (): ThunkAction =>
  (dispatch: Dispatch, getState: GetState) => {
    if (!isIgual(getState())) {
      dispatch({ type: AUTH_ISOPEN });
    }

    return null;
  };
