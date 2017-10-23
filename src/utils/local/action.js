/* @flow */

import type {
  Dispatch,
  ThunkAction,
} from '../../types';

export const ADDLISTLOCAL = 'ADDLISTLOCAL';
export const SETLOCAL = 'SETLOCAL';
/**
 * container for all the actions
*/

export const setLocal = (newlocal: Number): ThunkAction =>
  (dispatch: Dispatch) => dispatch({ type: SETLOCAL, id: newlocal });

export const setLocales = (listlocal: Array): ThunkAction =>
  (dispatch: Dispatch) => dispatch({ type: ADDLISTLOCAL, list: listlocal });
