/* @flow */

import type { Store as ReduxStore } from 'redux';
import actionAuth from '../containers/Auth/action';
import actionLogin from '../containers/Login/action';
import actionHome from '../containers/Home/action';
import actionUserInfo from '../containers/UserInfo/action';
import actionUtilFetch from '../utils/fetch/action';
import actionLocal from '../utils/local/action';
import actionNotification from '../utils/notification/action';

export type Auth = {
  signedIn: boolean,
  isopen: boolean,
  type: string,
  credentials: Object,
  userInfo: {
    username: string,
    password: string
  }
};

export type UtilFetch = {
  finanzas_gastos: Object,
  finanzas_ganancias: Object,
  finanzas_porvencer: Object,
  finanzas_porvencerok: Object,
  finanzas_cuotas: Object,
  cuentas: Object,
  mercaderia: Object,
  mercaderiacombo: Object,
  mercaderiacomboquitar: Object,
  personal: Object,
  data: Object,
};

export type Local = {
  id: number,
  list: Array,
};

export type Notification = {
  alertone: Object,
};

export type Login = {
  readyStatus: string,
  err: any,
  typeopen: string,
};

export type UserInfo = {
  [userId: string]: {
    readyStatus: string,
    err: any,
    info: Object,
  },
};

export type Cognito = {
  user: Object,
  cache: {
    userName: string,
    email: string,
  },
  state: string,
  error: any,
  userPool: Object,
  attributes: Object,
  creds: any,
  groups: Array,
  config: {
    region: string,
    userPool: string,
    clientId: string,
    identityPool: string,
  }
};

export type Reducer = {
  auth: Auth,
  utilfetch: UtilFetch,
  local: Local,
  cognito: Cognito,
  login: Login,
  userInfo: UserInfo,
  notification: Notification,
  router: any,
};

export type Action =
{ type: actionNotification.SEND_NOTIFICATION, param: any } |
{ type: actionLocal.ADDLISTLOCAL, list: Array } |
{ type: actionLocal.SETLOCAL, id: number } |
{ type: actionUtilFetch.FETCH_DATA_DELETE, name: string } |
{ type: actionUtilFetch.FETCH_DATA, param: Object, name: string, danger: boolean } |
{ type: actionUtilFetch.FETCH_SUCCESS, data: Array, method: string } |
{ type: actionUtilFetch.FETCH_SUCCESS_TC, data: Array, method: string, timecreate: any } |
{ type: actionUtilFetch.FETCH_ERROR, error: string } |
{ type: actionUtilFetch.FETCH_DATA_RESET } |
{ type: actionAuth.AUTH_LOGOUT } |
{ type: actionAuth.AUTH_SAVE_LOGIN, username: string, password: string } |
{ type: actionAuth.AUTH_LOGIN } |
{ type: actionAuth.AUTH_ISOPEN } |
{ type: actionLogin.LOGIN_REQUESTING } |
{ type: actionLogin.LOGIN_SUCCESS, data: Array<Object> } |
{ type: actionLogin.LOGIN_FAILURE, err: any } |
{ type: actionLogin.LOGIN_OPEN, newtype: string } |
{ type: actionLogin.LOGIN_CLOSE } |
{ type: actionUserInfo.USER_REQUESTING, userId: string } |
{ type: actionUserInfo.USER_SUCCESS, userId: string, data: Object } |
{ type: actionUserInfo.USER_FAILURE, userId: string, err: any };

export type Store = ReduxStore<Reducer, Action>;
// eslint-disable-next-line no-use-before-define
export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
