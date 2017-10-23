/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { CognitoUser } from 'amazon-cognito-identity-js';

import { Row, Col, CardGroup, Card, CardBlock, Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';

import type { Reducer, Dispatch } from '../../../types';
import * as actionLogin from '../../../containers/Login/action';
import actionCognito from '../../../utils/cognito/actions';

type Props = {
  username: String,
  error: String,
  userPool: Object,
  user: Object,
  sendVerificationCodePartial: () => void,
  setPasswordPartial: () => void,
  onCancel: () => void,
};

// Export this for unit testing more easily
export class AuthFormLoginPassReset extends PureComponent {
  props: Props;

  static defaultProps: {
    user: {},
    userPool: {},
    username: '',
    error: '',
    sendVerificationCodePartial: () => {},
    setPasswordPartial: () => {},
    onCancel: () => {},
  };

  state = {
    username: this.props.username,
    password: '',
    message: '',
    error: '',
    verificationCode: '',
  }

  componentDidMount() { }

  componentWillReceiveProps(nextProps) {
    const { error, user, username } = this.state;
    const newobj = { };
    let sendok = false;

    if (user !== nextProps.user) {
      sendok = true;
      newobj.user = nextProps.user;
    }

    if (error !== nextProps.error) {
      sendok = true;
      newobj.error = nextProps.error;
    }

    if (username !== nextProps.username) {
      sendok = true;
      newobj.username = nextProps.username;
    }

    if (sendok === true) {
      this.setState(newobj);
    }
  }

  // Handler Click Login
  handlerClickSendCode = () => {
    const { sendVerificationCodePartial, userPool } = this.props;
    const { username } = this.state;

    sendVerificationCodePartial(username, userPool)
      .then(() => this.setState({
        message: 'Verification code sent',
        error: '',
      }))
      .catch((err) => {
        if (err.code === 'UserNotFoundException') {
          this.setState({ error: 'User not found' });
        } else {
          this.setState({ error: err.message });
        }
      });
  };

  handlerClickSetNewPass = () => {
    const { setPasswordPartial, userPool } = this.props;
    const { username, password, verificationCode } = this.state;

    setPasswordPartial(username, userPool, verificationCode, password)
      .then(() => {
        this.setState({ message: 'Password reset', error: '' });
      })
      .catch((error) => {
        this.setState({ message: '', error: error.message });
      });
  };

  // Handler Click Cancel
  handlerClickCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  // handler change Texto Code
  handleChangeCode = (e) => {
    this.setState({ verificationCode: e.target.value });
  };

  // handler change Texto Username
  handleChangeUsername = (e) => {
    this.setState({ username: e.target.value });
  };

  // handler change Texto Password
  handleChangePass = (e) => {
    this.setState({ password: e.target.value });
  };

  getSubTitle = (): Element<any> => {
    const { error, message } = this.state;
    if (message !== '') {
      return <p className="text-success">{message}</p>;
    } else if (error === '') {
      return <p className="text-muted">Insert username and check your email for a code</p>;
    }

    return <p className="text-danger">{error}</p>;
  }

  renderUserList = (): Element<any> => {
    const { handlerClickCancel, handlerClickSendCode, handlerClickSetNewPass, handleChangePass, handleChangeUsername, handleChangeCode, getSubTitle } = this; // eslint-disable-line max-len
    const { state } = this;

    return (
      <Col md="8" className="animated fadeIn">
        <CardGroup className="mb-0">
          <Card className="p-4">
            <CardBlock className="card-body">
              <h1>Password Reset</h1>
              {getSubTitle()}
              <InputGroup className="mb-4">
                <InputGroupAddon><i className="icon-user" /></InputGroupAddon>
                <Input type="text" placeholder="User" value={state.username} onChange={handleChangeUsername} required />
                <Button color="primary" className="px-4" onClick={handlerClickSendCode} >Send code</Button>
              </InputGroup>
              <div className="dividerForm mb-4" />
              <InputGroup className="mb-3">
                <InputGroupAddon><i className="icon-key" /></InputGroupAddon>
                <Input type="text" placeholder="Code" value={state.verificationCode} onChange={handleChangeCode} required />
              </InputGroup>
              <InputGroup className="mb-4">
                <InputGroupAddon><i className="icon-lock" /></InputGroupAddon>
                <Input type="text" placeholder="New Password" value={state.password} onChange={handleChangePass} required />
              </InputGroup>
              <Row>
                <Col xs="6">
                  <Button color="primary" className="px-4" onClick={handlerClickSetNewPass} >Set new password</Button>
                </Col>
                <Col xs="6" className="text-right">
                  <Button color="link" className="px-0" onClick={handlerClickCancel} >Back</Button>
                </Col>
              </Row>
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

const getUser = (username, userPool) => {
  const user = new CognitoUser({
    Username: username,
    Pool: userPool,
  });
  return user;
};

const setPassword = (username, userPool, code, password, dispatch) =>
  new Promise((resolve, reject) => {
    const user = getUser(username, userPool);
    user.confirmPassword(code, password, {
      onSuccess: () => {
        dispatch(actionCognito.finishPasswordResetFlow());
        resolve();
      },
      onFailure: (err) => {
        dispatch(actionCognito.beginPasswordResetFlow(user, err.message));
        reject(err);
      },
    });
  });


const sendVerificationCode = (username, userPool, dispatch) =>
  new Promise((resolve, reject) => {
    const user = getUser(username, userPool);
    console.log(user);
    user.forgotPassword({
      onSuccess: () => {
        dispatch(actionCognito.continuePasswordResetFlow(user));
        resolve();
      },
      onFailure: (err) => {
        dispatch(actionCognito.beginPasswordResetFlow(user, err.message));
        reject(err);
      },
    });
  });

const mapStateToProps = ({ cognito }: Reducer) => {
  const props = {
    user: cognito.user,
    error: cognito.error,
    username: '',
    userPool: cognito.userPool,
  };
  if (cognito.user != null) {
    props.username = cognito.user.getUsername();
  }
  return props;
};

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  (dispatch: Dispatch) => ({
    onCancel: () => dispatch(actionLogin.openLogin(actionLogin.TYPE_OPEN_LOGIN)),
    sendVerificationCodePartial: (username, userPool) => sendVerificationCode(username, userPool, dispatch), // eslint-disable-line max-len
    setPasswordPartial: (user, userPool, code, password) => setPassword(user, userPool, code, password, dispatch), // eslint-disable-line max-len
  }),
);

export default connector(AuthFormLoginPassReset);
