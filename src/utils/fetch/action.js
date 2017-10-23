/* @flow */

import type {
  Dispatch,
  GetState,
  ThunkAction,
  Reducer,
} from '../../types';
import appSecrets from '../appSecrets';

export const FETCH_DATA_DELETE = 'FETCH_DATA_DELETE';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_ERROR = 'FETCH_ERROR';
export const FETCH_DATA = 'FETCH_DATA';
export const FETCH_DATA_RESET = 'FETCH_DATA_RESET';
export const FETCH_SUCCESS_TC = 'FETCH_SUCCESS_TC';

const isLoggin = (state: Reducer): boolean => {
  const cognito = state.cognito;

  if (cognito.state === 'LOGGED_IN') return true; // Preventing double fetching data

  return false;
};

export const deleteData = (_name: String): ThunkAction =>
  (dispatch: Dispatch) => dispatch({ type: FETCH_DATA_DELETE, name: _name }); // eslint-disable-line max-len

export const resetData = (): ThunkAction =>
  (dispatch: Dispatch) => dispatch({ type: FETCH_DATA_RESET }); // eslint-disable-line max-len

export const addData = (_param: Object): ThunkAction =>
  (dispatch: Dispatch) => dispatch({ type: FETCH_DATA, name: _param.name, param: _param.param, danger: _param.danger }); // eslint-disable-line max-len

export const fetchData = (url: String, namesave: String, axios: any, _timecreate: any): ThunkAction => // eslint-disable-line max-len
  (dispatch: Dispatch) => axios.get(url)
    .then((res) => {
      if (namesave === 'none') {
        return res;
      }

      const newdata = res.data.Items;
      if (_timecreate) {
        return dispatch({ type: FETCH_SUCCESS_TC, data: newdata, method: namesave, timecreate: _timecreate }); // eslint-disable-line max-len
      }

      return dispatch({ type: FETCH_SUCCESS, data: newdata, method: namesave });
    })
    .catch((err) => {
      console.log(err.message);
      if (namesave !== 'none') {
        dispatch({ type: FETCH_ERROR, error: err.message });
      }
    });

const getQueryString = (params) => {
  const esc = encodeURIComponent;
  const eq = '=';
  return Object.keys(params)
    .map(k => esc(k) + eq + esc(params[k]))
    .join('&');
};

export const loadAllData = (_objfetch: Object, namesave: String, _timecreate:any): ThunkAction =>
  (dispatch: Dispatch, getState: GetState, axios: any) => {
    if (isLoggin(getState())) {
      const _objservice = appSecrets[_objfetch.service];
      const qst = '?';
      const qs = qst + getQueryString(_objfetch.query);
      const apiurl = _objservice.urlapi + _objservice.api[_objfetch.method] + qs;
      return dispatch(fetchData(apiurl, namesave, axios, _timecreate));
    }
    console.log(_objfetch.method);
    console.log('NO ESTA LOGEADO!');
    /* istanbul ignore next */
    return null;
  };

export const goSendData = (_objsend: any, _mas: Number): ThunkAction => // eslint-disable-line max-len
  (dispatch: Dispatch) => {
    let _timecreate = new Date().getTime();
    if (_mas && _mas > 0) {
      _timecreate += _mas;
    }
    return dispatch(loadAllData(_objsend, 'none', _timecreate));
  };
export const goGetFinanzasPorVencerDelete = (_state: Number) => {
  if (_state === 1) {
    return 'finanzas_porvencerok';
  }
  return 'finanzas_porvencer';
};
export const goGetFinanzasPorVencerParam = (_state: Number, _idlocal: any, _timecreate: any) => {
  const _objnew = { name: 'goGetFinanzasPorVencer', param: { state: _state, idlocal: _idlocal, mas: _timecreate } };
  return _objnew;
};
export const goGetFinanzasPorVencer = (_state: Number, _idlocal: any, _timecreate: any): ThunkAction => // eslint-disable-line max-len
  (dispatch: Dispatch) => {
    let _namevar = 'finanzas_porvencer';
    if (_state === 1) {
      _namevar = 'finanzas_porvencerok';
    }

    return dispatch(loadAllData({
      service: 'aws',
      method: 'pvget',
      query: {
        dateend: 121911445232301,
        state: _state,
        dateinit: 12,
        idlocal: _idlocal,
      } }, _namevar, _timecreate));
  };

export const goGetFinanzasGananciasDelete = () => ('finanzas_ganancias');
export const goGetFinanzasGananciasParam = (_idlocal: any, _timecreate: any) => {
  const _objnew = { name: 'goGetFinanzasGanancias', param: { idlocal: _idlocal, mas: _timecreate } };
  return _objnew;
};
export const goGetFinanzasGanancias = (_idlocal: any, _timecreate: any): ThunkAction =>
  (dispatch: Dispatch) => dispatch(loadAllData({
    service: 'aws',
    method: 'getfinanzas',
    query: {
      dateend: 121911445232301,
      idtype: 1,
      dateinit: 12,
      idlocal: _idlocal,
    } }, 'finanzas_ganancias', _timecreate));

export const goGetFinanzasCuotasDelete = () => ('finanzas_cuotas');
export const goGetFinanzasCuotasParam = (_idlocal: any, _timecreate: any) => {
  const _objnew = { name: 'goGetFinanzasCuotas', param: { idlocal: _idlocal, mas: _timecreate } };
  return _objnew;
};
export const goGetFinanzasCuotas = (_idlocal: any, _timecreate: any): ThunkAction =>
  (dispatch: Dispatch) => dispatch(loadAllData({
    service: 'aws',
    method: 'pvcuotasget',
    query: {
      idlocal: _idlocal,
    } }, 'finanzas_cuotas', _timecreate));

export const goGetFinanzasGastosDelete = () => ('finanzas_gastos');
export const goGetFinanzasGastosParam = (_idlocal: any, _timecreate: any) => {
  const _objnew = { name: 'goGetFinanzasGastos', param: { idlocal: _idlocal, mas: _timecreate } };
  return _objnew;
};
export const goGetFinanzasGastos = (_idlocal: any, _timecreate: any): ThunkAction =>
  (dispatch: Dispatch) => dispatch(loadAllData({
    service: 'aws',
    method: 'getfinanzas',
    query: {
      dateend: 121911445232301,
      idtype: 0,
      dateinit: 12,
      idlocal: _idlocal,
    } }, 'finanzas_gastos', _timecreate));

export const goGetCuentasDelete = () => ('cuentas');
export const goGetCuentasParam = (_timecreate: any) => {
  const _objnew = { name: 'goGetCuentas', param: { mas: _timecreate } };
  return _objnew;
};
export const goGetCuentas = (_timecreate: any): ThunkAction =>
  (dispatch: Dispatch) => dispatch(loadAllData({
    service: 'aws',
    method: 'cuentasget',
    query: {
      type: 1,
    } }, 'cuentas', _timecreate));

export const goGetPersonalDelete = () => ('personal');
export const goGetPersonalParam = (_timecreate: any) => {
  const _objnew = { name: 'goGetPersonal', param: { mas: _timecreate } };
  return _objnew;
};
export const goGetPersonal = (_timecreate: any): ThunkAction =>
  (dispatch: Dispatch) => dispatch(loadAllData({
    service: 'aws',
    method: 'rrhhpersonalget',
    query: { } }, 'personal', _timecreate));

export const goGetMercaderiaDelete = () => ('mercaderia');
export const goGetMercaderiaParam = (_idlocal: any, _timecreate: any) => {
  const _objnew = { name: 'goGetMercaderia', param: { idlocal: _idlocal, mas: _timecreate } };
  return _objnew;
};
export const goGetMercaderia = (_idlocal: any, _timecreate: any): ThunkAction =>
  (dispatch: Dispatch) => dispatch(loadAllData({
    service: 'aws',
    method: 'mercaderiaget',
    query: {
      type: 1,
      idlocal: _idlocal,
    } }, 'mercaderia', _timecreate));

export const goGetMercaderiaComboDelete = (_idtype: Number) => {
  let _itemname = 'mercaderiacomboquitar';
  if (_idtype === 1) _itemname = 'mercaderiacombo';
  return (_itemname);
};
export const goGetMercaderiaComboParam = (_idtype: Number, _idlocal: any, _timecreate: any) => {
  const _objnew = { name: 'goGetMercaderiaCombo', param: { idtype: _idtype, idlocal: _idlocal, mas: _timecreate } };
  return _objnew;
};
export const goGetMercaderiaCombo = (_idtype: Number, _idlocal: any, _timecreate: any): ThunkAction => // eslint-disable-line max-len
  (dispatch: Dispatch) => {
    let _itemname = 'mercaderiacomboquitar';
    if (_idtype === 1) _itemname = 'mercaderiacombo';

    return dispatch(loadAllData({
      service: 'aws',
      method: 'mercaderiacomboget',
      query: {
        idtype: _idtype,
        idlocal: _idlocal,
      } }, _itemname, _timecreate));
  };
