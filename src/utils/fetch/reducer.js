/* @flow */

import _ from 'lodash';

import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  FETCH_DATA,
  FETCH_SUCCESS_TC,
  FETCH_DATA_RESET,
  FETCH_DATA_DELETE,
} from './action';
import type { UtilFetch, Action } from '../../types';
import { cloneArray } from '../appUtils';

type State = UtilFetch;

const initialState = {
  finanzas_gastos: {},
  finanzas_ganancias: {},
  finanzas_porvencer: {},
  finanzas_porvencerok: {},
  finanzas_cuotas: {},
  cuentas: {},
  mercaderia: {},
  mercaderiacombo: {},
  mercaderiacomboquitar: {},
  personal: {},
  data: {
    lastfetch: '',
    data: [],
  },
};

const setfetchsuccess = (state: State, action: Action) => {
  const newd = new Date();
  return _.assign({}, state, {
    [action.method]: { data: action.data, lastdate: newd.getTime() },
  });
};

const setfetchsuccesstm = (state: State, action: Action) => {
  const newd = new Date();

  const arrnew = [];
  const n = state.data.data.length;
  if (n > 0) {
    let i;
    for (i = 0; i < n; i += 1) {
      if (state.data.data[i].createdate !== action.timecreate) {
        arrnew.push(state.data.data[i]);
      }
    }
  }
  return _.assign({}, state, {
    [action.method]: { data: action.data, lastdate: newd.getTime() },
    data: {
      lastfetch: action.timecreate,
      data: arrnew,
    },
  });
};

const setData = (state: State, action: Action) => {
  const arrnew = cloneArray(state.data.data);
  let newd = new Date().getTime();
  if (action.param.mas && action.param.mas > 0) {
    newd += action.param.mas;
  }
  newd += arrnew.length;
  const newlastfetch = state.data.lastfetch;

  arrnew.push({ name: action.name, param: action.param, danger: action.danger, createdate: newd }); // eslint-disable-line max-len
  return _.assign({}, state, {
    data: {
      lastfetch: newlastfetch,
      data: arrnew,
    },
  });
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FETCH_DATA_DELETE:
      return _.assign({}, state, {
        [action.name]: {
          lastdate: undefined,
          data: undefined,
        },
      });
    case FETCH_SUCCESS_TC:
      return setfetchsuccesstm(state, action);
    case FETCH_SUCCESS:
      return setfetchsuccess(state, action);
    case FETCH_ERROR:
      return _.assign({}, state, {
        data: action.error,
      });
    case FETCH_DATA:
      return setData(state, action);
    case FETCH_DATA_RESET:
      return _.assign({}, state, {
        finanzas_gastos: {},
        finanzas_ganancias: {},
        finanzas_porvencer: {},
        finanzas_porvencerok: {},
        finanzas_cuotas: {},
        cuentas: {},
        mercaderia: {},
        mercaderiacombo: {},
        mercaderiacomboquitar: {},
        personal: {},
        data: {
          lastfetch: '',
          data: [],
        },
      });
    default:
      return state;
  }
};
