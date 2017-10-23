/* @flow */

import _ from 'lodash';

import {
  ADDLISTLOCAL,
  SETLOCAL,
} from './action';
import type { Local, Action } from '../../types';

type State = Local;

const initialState = {
  id: 0,
  list: [
    { name: 'Providencia', id: 0, token: 'quepasawuashin' },
    { name: 'La Reina', id: 1, token: 'quepasawuashin' },
  ],
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ADDLISTLOCAL:
      return _.assign({}, state, {
        list: action.list,
      });
    case SETLOCAL:
      return _.assign({}, state, {
        id: action.id,
      });
    default:
      return state;
  }
};
