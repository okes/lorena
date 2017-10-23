/* @flow */

import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import notification from '../utils/notification/reducer';
import local from '../utils/local/reducer';
import utilfetch from '../utils/fetch/reducer';
import cognito from '../utils/cognito/reducers';
import auth from '../containers/Auth/reducer';
import login from '../containers/Login/reducer';
import userInfo from '../containers/UserInfo/reducer';

export default combineReducers({
  auth,
  utilfetch,
  local,
  cognito,
  login,
  userInfo,
  notification,
  router,
});
