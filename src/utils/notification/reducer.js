/* @flow */

import _ from 'lodash';

import {
  SEND_NOTIFICATION,
} from './action';
import type { Notification, Action } from '../../types';

type State = Notification;

const initialState = {
  alertone: {},
};

const sendNewData = (state: State, action: Action) => {
  let newd = new Date().getTime();
  if (action.param.mas && action.param.mas > 0) {
    newd += action.param.mas;
  }

  return _.assign({}, state, {
    alertone: { param: action.param, createdate: newd },
  });
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SEND_NOTIFICATION:
      return sendNewData(state, action);
    default:
      return state;
  }
};
