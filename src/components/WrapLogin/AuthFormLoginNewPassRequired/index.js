/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import { Row, Col, CardGroup, Card, CardBlock, Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';

import type { Cognito as CognitoType, Reducer, Dispatch } from '../../../types';
import actionCognito from '../../../utils/cognito/actions';

type Props = {
  cognito: CognitoType,
  user: Object,
  error: String,
  setNewPasswordPartial: () => void,
};

// Export this for unit testing more easily
export class AuthFormLoginNewPassRequired extends PureComponent {
  props: Props;

  static defaultProps: {
    cognito: {},
    user: {},
    error: '',
    setNewPasswordPartial: () => {},
  };

  state = {
    user: this.props.user,
    error: this.props.error,
    password: '',
  }

  componentDidMount() { }

  componentWillReceiveProps(nextProps) {
    const { error, user } = this.state;
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

    if (sendok === true) {
      this.setState(newobj);
    }
  }

  // Handler Click Login
  handlerClickLogin = () => {
    const { setNewPasswordPartial, cognito } = this.props;
    const { user, password } = this.state;
    setNewPasswordPartial(password, user, cognito.config);
  };

  // handler change Texto Password
  handleChangePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  getSubTitle = (): Element<any> => {
    const { error } = this.state;

    if (error === '') {
      return <p className="text-muted">New password required, since this is your first login</p>;
    }

    return <p className="text-danger">{error}</p>;
  }

  renderUserList = (): Element<any> => {
    const { handlerClickLogin, handleChangePassword, getSubTitle } = this;
    const { state } = this;

    return (
      <Col md="8" className="animated fadeIn">
        <CardGroup className="mb-0">
          <Card className="p-4">
            <CardBlock className="card-body">
              <h1>New Password Required</h1>
              {getSubTitle()}
              <InputGroup className="mb-4">
                <InputGroupAddon><i className="icon-lock" /></InputGroupAddon>
                <Input type="password" placeholder="New Password" value={state.password} onChange={handleChangePassword} />
              </InputGroup>
              <Row>
                <Col xs="6">
                  <Button color="primary" className="px-4" onClick={handlerClickLogin} >Set New Password</Button>
                </Col>
                <Col xs="6" className="text-right">
                  <Button color="link" className="px-0">Back</Button>
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

// SET NEW PASSWORD REQUIRED
const setNewPasswordPartial = (password, user, config, userAttributes, dispatch) =>
  user.completeNewPasswordChallenge(password, userAttributes, {
    onSuccess: () => dispatch(actionCognito.authenticated(user)),
    onFailure: error => dispatch(actionCognito.newPasswordRequiredFailure(user, error.message)),
    mfaRequired: () => dispatch(actionCognito.mfaRequired(user)),
    newPasswordRequired: () => dispatch(actionCognito.newPasswordRequired(user)),
  });

const connector: Connector<{}, Props> = connect(
  ({ login, cognito }: Reducer) => (
    { login, cognito, user: cognito.user, error: cognito.error }
  ),
  (dispatch: Dispatch) => ({
    setNewPasswordPartial: (_pass: string, user: Object, config: Object, userAttributes: any) => setNewPasswordPartial(_pass, user, config, userAttributes, dispatch), // eslint-disable-line max-len
  }),
);

export default connector(AuthFormLoginNewPassRequired);
