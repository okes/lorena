/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import { Row, Col, CardGroup, Card, CardBlock, Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';

import type { Reducer, Dispatch } from '../../../types';
import actionCognito from '../../../utils/cognito/actions';

type Props = {
  user: Object,
  error: String,
  onCancel: () => void,
  verifyPartial: () => void,
};

// Export this for unit testing more easily
export class AuthFormLoginEmailVerification extends PureComponent {
  props: Props;

  static defaultProps: {
    user: {},
    error: '',
    onCancel: () => {},
    verifyPartial: () => {},
  };

  state = {
    user: this.props.user,
    error: this.props.error,
    verificationCode: '',
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
    const { verifyPartial } = this.props;
    const { user, verificationCode } = this.state;
    verifyPartial(verificationCode, user);
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

  getSubTitle = (): Element<any> => {
    const { error } = this.state;

    if (error === '') {
      return <p className="text-muted">You must verify your email address.  Please check your email for a code</p>;
    }

    return <p className="text-danger">{error}</p>;
  }

  renderUserList = (): Element<any> => {
    const { handlerClickLogin, handlerClickCancel, handleChangeCode, getSubTitle } = this;
    const { state } = this;

    return (
      <Col md="8" className="animated fadeIn">
        <CardGroup className="mb-0">
          <Card className="p-4">
            <CardBlock className="card-body">
              <h1>Verification Code</h1>
              {getSubTitle()}
              <InputGroup className="mb-4">
                <InputGroupAddon><i className="icon-key" /></InputGroupAddon>
                <Input type="text" placeholder="Code" value={state.verificationCode} onChange={handleChangeCode} required />
              </InputGroup>
              <Row>
                <Col xs="6">
                  <Button color="primary" className="px-4" onClick={handlerClickLogin} >Confirmar</Button>
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

// Veryfy email
export const verifyEmail = (verificationCode, user, dispatch) =>
  new Promise((resolve, reject) => {
    user.verifyAttribute('email', verificationCode, {
      onSuccess: () => {
        dispatch(actionCognito.login(user));
        resolve();
      },
      inputVerificationCode: () => {
        dispatch(actionCognito.emailVerificationRequired(user));
        reject();
      },
      onFailure: (error) => {
        dispatch(actionCognito.emailVerificationFailed(user, error.message));
        reject();
      },
    });
  });

const connector: Connector<{}, Props> = connect(
  ({ login, cognito }: Reducer) => (
    { login, user: cognito.user, error: cognito.error }
  ),
  (dispatch: Dispatch) => ({
    onCancel: () => dispatch(actionCognito.logout()),
    verifyPartial: (verificationCode: string, user: Object) => verifyEmail(verificationCode, user, dispatch), // eslint-disable-line max-len
  }),
);

export default connector(AuthFormLoginEmailVerification);
