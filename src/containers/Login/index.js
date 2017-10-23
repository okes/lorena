/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import ReactLoading from 'react-loading';

import * as actionLogin from './action';
import actionCognito from '../../utils/cognito/actions';
import type { Login as LoginType, Auth as AuthType, UtilFetch as UtilFetchType, Dispatch, Reducer } from '../../types';
import appSecrets from '../../utils/appSecrets';
import LoginCont from '../../components/WrapLogin';
import { cloneArray } from '../../utils/appUtils';
import { goGetFinanzasPorVencer, goGetFinanzasGanancias, goGetFinanzasCuotas, goGetFinanzasGastos, goGetCuentas, goGetPersonal, goGetMercaderia, goGetMercaderiaCombo, resetData } from '../../utils/fetch/action';

type Props = {
  login: LoginType,
  utilfetch: UtilFetchType,
  auth: AuthType,
  cognito: Object,
  setupCognito: () => void,
  getFinanzasPorVencer: () => void,
  getFinanzasGanancias: () => void,
  getFinanzasCuotas: () => void,
  getFinanzasGastos: () => void,
  getCuentas: () => void,
  getPersonal: () => void,
  getMercaderia: () => void,
  getMercaderiaCombo: () => void,
  goReset: () => void,
};

// Export this for unit testing more easily
export class Login extends PureComponent {
  props: Props;

  static defaultProps: {
    login: {
      readyStatus: actionLogin.LOGIN_INVALID,
      typeopen: actionLogin.TYPE_OPEN_LOGIN,
    },
    auth: {},
    utilfetch: {},
    cognito: {},
    setupCognito: () => {},
    getFinanzasPorVencer: () => {},
    getFinanzasGanancias: () => {},
    getFinanzasCuotas: () => {},
    getFinanzasGastos: () => {},
    getCuentas: () => {},
    getPersonal: () => {},
    getMercaderia: () => {},
    getMercaderiaCombo: () => {},
    goReset: () => {},
  };

  state = {
    arrdata: [],
    arrsend: [],
  }

  componentDidMount() {
    const { setupCognito } = this.props;
    setupCognito(appSecrets.aws.config);
  }

  componentDidUpdate() {
    const { gotFetch } = this;
    const { auth, utilfetch, goReset } = this.props;
    if (auth.signedIn === true) {
      gotFetch();
    } else if (utilfetch.data.data.length > 0 || Number(utilfetch.data.lastfetch) > 10) {
      goReset();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { checkFetch } = this;
    const { auth } = nextProps;
    const { arrdata, arrsend } = this.state;
    if (auth.signedIn === true) {
      checkFetch(nextProps.utilfetch.data);
    } else if (arrdata.length > 0 || arrsend.length > 0) {
      this.setState({ arrdata: [], arrsend: [] });
    }
  }

  gotFetch = () => {
    const { state, checkAddNewFetch } = this;
    const { getFinanzasPorVencer, getFinanzasGanancias, getFinanzasCuotas, getFinanzasGastos, getCuentas, getPersonal, getMercaderia, getMercaderiaCombo } = this.props; // eslint-disable-line max-len
    const n = state.arrdata.length;
    if (n > 0) {
      const tempob = state.arrdata[0];
      if (checkAddNewFetch(tempob.createdate, state.arrsend)) {
        const newarrsend = cloneArray(state.arrsend);
        newarrsend.push(state.arrdata[0]);
        this.setState({ arrsend: newarrsend });
        switch (tempob.name) {
          case 'goGetFinanzasPorVencer':
            getFinanzasPorVencer(tempob.param.state, tempob.param.idlocal, tempob.createdate);
            break;
          case 'goGetFinanzasGanancias':
            getFinanzasGanancias(tempob.param.idlocal, tempob.createdate);
            break;
          case 'goGetFinanzasCuotas':
            getFinanzasCuotas(tempob.param.idlocal, tempob.createdate);
            break;
          case 'goGetFinanzasGastos':
            getFinanzasGastos(tempob.param.idlocal, tempob.createdate);
            break;
          case 'goGetCuentas':
            getCuentas(tempob.createdate);
            break;
          case 'goGetPersonal':
            getPersonal(tempob.createdate);
            break;
          case 'goGetMercaderia':
            getMercaderia(tempob.param.idlocal, tempob.createdate);
            break;
          case 'goGetMercaderiaCombo':
            getMercaderiaCombo(tempob.param.idtype, tempob.param.idlocal, tempob.createdate);
            break;
          default:
            console.log('nada');
        }
      }
    }
  }

  checkFetch = (data) => {
    const { state, checkAddNewFetch } = this;
    const newarr = cloneArray(state.arrdata);
    let realarr = [];
    const n = data.data.length;
    let newpush = false;
    if (n > 0) {
      let i;
      for (i = 0; i < n; i += 1) {
        const temp = data.data[i];
        if (checkAddNewFetch(temp.createdate, state.arrdata)) {
          newarr.push(temp);
        }
      }
      newpush = true;
    }

    if (Number(data.lastfetch) > 10) {
      const newarrdos = [];
      const nn = newarr.length;
      let ii;
      for (ii = 0; ii < nn; ii += 1) {
        const tempa = newarr[ii];
        if (Number(tempa.createdate) === Number(data.lastfetch)) {
          newpush = true;
        } else {
          newarrdos.push(tempa);
        }
      }
      realarr = newarrdos;
    } else {
      realarr = newarr;
    }

    if (newpush) {
      this.setState({ arrdata: realarr });
    }
  };

  checkAddNewFetch = (iddata, arrdata) => {
    const n = arrdata.length;
    if (n > 0) {
      let i;
      for (i = 0; i < n; i += 1) {
        if (arrdata[i].createdate === iddata) {
          return false;
        }
      }
    }
    return true;
  }

  renderUserList = (): Element<any> => {
    const { login, auth, cognito } = this.props;

    let el = '';

    if (typeof document !== 'undefined') {
      el = document.querySelector('#divapp');
    }

    if (auth.isopen === false) {
      if (el !== null && el !== '') {
        el.classList.remove('d-none');
      }

      return null;
    }

    if (el !== null && el !== '') {
      el.classList.add('d-none');
    }

    if (cognito.config.region === null && cognito.config.userPool === null) {
      return <ReactLoading type="spin" delay={0} color="#2592db" height={50} width={50} />;
    }

    switch (login.typeopen) {
      case actionLogin.TYPE_OPEN_RESET_PASSWORD:
      case actionLogin.TYPE_OPEN_LOGIN:
        return <LoginCont />;
      default:
        return (
          <div>
            <p>Unrecognised type open state</p>
          </div>
        );
    }
  };

  render() {
    const { renderUserList } = this;
    return (
      renderUserList()
    );
  }
}

const connector: Connector<{}, Props> = connect(
  ({ login, auth, cognito, utilfetch }: Reducer) => ({ login, auth, cognito, utilfetch }),
  (dispatch: Dispatch) => ({
    setupCognito: (_config: Object) => dispatch(actionCognito.configure(_config)),
    getFinanzasPorVencer: (_state: Number, _idlocal: any, _timecreate: any) => dispatch(goGetFinanzasPorVencer(_state, _idlocal, _timecreate)), // eslint-disable-line max-len
    getFinanzasGanancias: (_idlocal: any, _timecreate: any) => dispatch(goGetFinanzasGanancias(_idlocal, _timecreate)), // eslint-disable-line max-len
    getFinanzasCuotas: (_idlocal: any, _timecreate: any) => dispatch(goGetFinanzasCuotas(_idlocal, _timecreate)), // eslint-disable-line max-len
    getFinanzasGastos: (_idlocal: any, _timecreate: any) => dispatch(goGetFinanzasGastos(_idlocal, _timecreate)), // eslint-disable-line max-len
    getCuentas: (_timecreate: any) => dispatch(goGetCuentas(_timecreate)),
    getPersonal: (_timecreate: any) => dispatch(goGetPersonal(_timecreate)),
    getMercaderia: (_idlocal: any, _timecreate: any) => dispatch(goGetMercaderia(_idlocal, _timecreate)), // eslint-disable-line max-len
    getMercaderiaCombo: (_idtype: any, _idlocal: any, _timecreate: any) => dispatch(goGetMercaderiaCombo(_idtype, _idlocal, _timecreate)), // eslint-disable-line max-len
    goReset: () => dispatch(resetData()),
  }),
);

export default connector(Login);
