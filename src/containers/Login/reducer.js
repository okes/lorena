/* @flow */

import _ from 'lodash';

import {
  LOGIN_INVALID,
  LOGIN_REQUESTING,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_OPEN,
  TYPE_OPEN_LOGIN,
} from './action';
import type { Login, Action } from '../../types';

type State = Login;

const initialState = {
  readyStatus: LOGIN_INVALID,
  err: null,
  typeopen: TYPE_OPEN_LOGIN,
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case LOGIN_REQUESTING:
      return _.assign({}, state, { readyStatus: LOGIN_REQUESTING });
    case LOGIN_FAILURE:
      return _.assign({}, state, {
        readyStatus: LOGIN_FAILURE,
        err: action.err,
      });
    case LOGIN_SUCCESS:
      return _.assign({}, state, {
        readyStatus: LOGIN_SUCCESS,
      });
    case LOGIN_OPEN:
      return _.assign({}, state, {
        typeopen: action.newtype,
      });
    default:
      return state;
  }
};
