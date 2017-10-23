/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Element } from 'react';
import type { Connector } from 'react-redux';

import * as actionLogin from '../Login/action';
import * as actionAuth from './action';
import type { Auth as AuthType, Dispatch, Reducer } from '../../types';

type Props = {
  auth: AuthType,
  showLogin: () => void,
  authLogin: () => void,
};

export default function (Component) {
  class AuthenticatedComponent extends PureComponent {
    // Export this for unit testing more easily
    props: Props;

    static defaultProps: {
      auth: {},
      showLogin: () => {},
      authLogin: () => {},
    };

    componentDidMount() { }

    componentWillMount() {
      this.chekCheka();
    }

    componentWillReceiveProps() {
      this.chekCheka();
    }

    chekCheka() {
      const { auth, showLogin, authLogin } = this.props;
      if (auth.signedIn !== true && auth.isopen !== true) {
        showLogin();
        authLogin();
      }
    }

    renderUserList = (): Element<any> => {
      const { auth } = this.props;
      if (auth.signedIn === true) {
        return (
          <Component {...this.props} />
        );
      }

      return null;
    }

    render() {
      const { renderUserList } = this;
      return (
        renderUserList()
      );
    }
  }

  const connector: Connector<{}, Props> = connect(
    ({ auth }: Reducer) => ({ auth }),
    (dispatch: Dispatch) => ({
      authLogin: () => dispatch(actionAuth.openLogin()),
      showLogin: () => dispatch(actionLogin.openLogin(actionLogin.TYPE_OPEN_LOGIN)),
    }),
  );

  return connector(AuthenticatedComponent);
}
