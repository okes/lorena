/* @flow */

import type {
  Dispatch,
  GetState,
  ThunkAction,
  Reducer,
} from '../../types';

export const LOGIN_OPEN = 'LOGIN_OPEN';
export const LOGIN_INVALID = 'LOGIN_INVALID';
export const LOGIN_REQUESTING = 'LOGIN_REQUESTING';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const TYPE_OPEN_LOGIN = 'TYPE_OPEN_LOGIN';
export const TYPE_OPEN_REGISTER = 'TYPE_OPEN_REGISTER';
export const TYPE_OPEN_RESET_PASSWORD = 'TYPE_OPEN_RESET_PASSWORD';
export const TYPE_OPEN_CHANGE_PASSWORD = 'TYPE_OPEN_CHANGE_PASSWORD';
export const TYPE_OPEN_UPDATE_EMAIL = 'TYPE_OPEN_UPDATE_EMAIL';

const isIgual = (state: Reducer, _newtype: String): boolean => {
  const login = state.login;
  const auth = state.auth;

  if (auth.isopen === true && login.typeopen === _newtype) return true;

  return false;
};

export const openLogin = (_type: String): ThunkAction =>
  (dispatch: Dispatch, getState: GetState) => {
    if (!isIgual(getState(), _type)) {
      dispatch({ type: LOGIN_OPEN, newtype: _type });
    }

    return null;
  };
