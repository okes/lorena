/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import ReactLoading from 'react-loading';
import { Row, Col, CardGroup, Card, CardBlock, Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';

import type { Cognito as CognitoType, Reducer, Dispatch } from '../../../types';
import * as actionAuth from '../../../containers/Auth/action';
import * as actionLogin from '../../../containers/Login/action';
import { authenticate } from '../../../utils/cognito/auth';
import actionCognito from '../../../utils/cognito/actions';

type Props = {
  cognito: CognitoType,
  email: String,
  username: String,
  initnow: Boolean,
  password: String,
  error: String,
  authSaveLogin: () => void,
  clearCache: () => void,
  onSubmit: () => void,
  showForgot: () => void,
};

// Export this for unit testing more easily
export class AuthFormLogin extends PureComponent {
  props: Props;

  static defaultProps: {
    cognito: {},
    email: '',
    username: '',
    password: '',
    initnow: false,
    error: '',
    authSaveLogin: () => {},
    clearCache: () => {},
    onSubmit: () => {},
    showForgot: () => {},
  };

  state = {
    username: this.props.username,
    email: this.props.email,
    error: this.props.error,
    password: this.props.password,
    initnow: this.props.initnow,
  }

  componentDidMount() {
    const { props, checkLoginGO } = this;
    if (props.username !== '' && props.password !== '') {
      checkLoginGO(props.username, props.password);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { error, username } = this.state;
    const newobj = { };
    let sendok = false;

    if (username !== nextProps.username) {
      sendok = true;
      newobj.username = nextProps.username;
    }

    if (error !== nextProps.error) {
      sendok = true;
      newobj.error = nextProps.error;
    }

    if (sendok === true) {
      this.setState(newobj);
    }
  }

  componentWillUnmount() {
    const { clearCache } = this.props;
    clearCache();
  }

  checkLoginGO = (username: String, password: String) => {
    const { onSubmit, cognito, authSaveLogin } = this.props;
    const { setState } = this;
    authSaveLogin(username, password);
    onSubmit(username, password, cognito.userPool, cognito.config)
      .then(() => {
        console.log('login ok!');
      })
      .catch((error) => {
        setState({ initnow: false });
        console.log(error);
        console.log('error de login');
      });
  };

  // Handler Click Login 
  handlerClickLogin = () => {
    const { checkLoginGO } = this;
    const { username, password } = this.state;
    checkLoginGO(username, password);
  };

  handlerClickForgtoPass = () => {
    const { showForgot } = this.props;
    showForgot();
  };

  // handler change Texto Username
  handleChangeUsername = (e) => {
    this.setState({ username: e.target.value });
  };

  // handler change Texto Password
  handleChangePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  getSubTitle = (): Element<any> => {
    const { error } = this.state;

    if (error === '') {
      return <p className="text-muted">Iniciar sesión con tu cuenta</p>;
    }

    return <p className="text-danger">{error}</p>;
  }

  renderUserList = (): Element<any> => {
    const { handlerClickLogin, handleChangeUsername, handleChangePassword, handlerClickForgtoPass, getSubTitle } = this; // eslint-disable-line max-len
    const { state } = this;

    if (state.initnow) {
      return <ReactLoading type="spin" delay={0} color="#2592db" height={50} width={50} />;
    }

    return (
      <Col md="8" className="animated fadeIn">
        <CardGroup className="mb-0">
          <Card className="p-sm-4">
            <CardBlock className="card-body">
              <h1>Iniciar Sesion</h1>
              {getSubTitle()}
              <InputGroup className="mb-3">
                <InputGroupAddon><i className="icon-user" /></InputGroupAddon>
                <Input type="text" placeholder="Username" value={state.username} onChange={handleChangeUsername} />
              </InputGroup>
              <InputGroup className="mb-4">
                <InputGroupAddon><i className="icon-lock" /></InputGroupAddon>
                <Input type="password" placeholder="Password" value={state.password} onChange={handleChangePassword} />
              </InputGroup>
              <Row>
                <Col xs="12" sm="6" className="mb-2">
                  <Button color="primary" className="px-4" onClick={handlerClickLogin} block>Iniciar!</Button>
                </Col>
                <Col xs="6" className="text-right mb-2">
                  <Button color="link" className="px-0" onClick={handlerClickForgtoPass} >Olvidaste tu contraseña?</Button>
                </Col>
              </Row>
            </CardBlock>
          </Card>
          <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
            <CardBlock className="card-body text-center">
              <img src={require('../assets/logotm.svg')} alt="Logo" role="presentation" width="150" />
            </CardBlock>
          </Card>
        </CardGroup>
      </Col>
    );
  }

  render() {
    const { renderUserList } = this;
    return (
      renderUserList()
    );
  }
}

const mapStateToProps = ({ cognito }: Reducer) => {
  let username = '';
  if (cognito.user) {
    username = cognito.user.getUsername();
  } else if (cognito.userName) {
    username = cognito.cache.userName;
  }

  let password = '';
  let initnow = false;
  if (localStorage.getItem('tmcdataname')) {
    const lsUser = localStorage.getItem('tmcdataname');
    const lsPass = localStorage.getItem('tmcdatapass');
    if (username === lsUser && lsUser.length > 1) {
      password = lsPass;
      initnow = true;
    }
  }

  return {
    username,
    password,
    initnow,
    cognito,
    email: cognito.cache.email,
    error: cognito.error,
  };
};

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  (dispatch: Dispatch) => ({
    authSaveLogin: (_name: string, _pass: string) => dispatch(actionAuth.savelogin(_name, _pass)),
    onSubmit: (username: string, _pass: string, userPool: Object, config: Object) => authenticate(username, _pass, userPool, config, dispatch), // eslint-disable-line max-len
    clearCache: () => dispatch(actionCognito.clearCache()),
    showForgot: () => dispatch(actionLogin.openLogin(actionLogin.TYPE_OPEN_RESET_PASSWORD)),
  }),
);

export default connector(AuthFormLogin);
