/* @flow */

import type {
  Dispatch,
  ThunkAction,
} from '../../types';

export const SEND_NOTIFICATION = 'SEND_NOTIFICATION';
/**
 * container for all the actions
*/

export const sendNotification = (_param: any): ThunkAction =>
  (dispatch: Dispatch) => dispatch({ type: SEND_NOTIFICATION, param: _param });
