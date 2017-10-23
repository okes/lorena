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
  confirmPartial: () => void,
  onResendPartial: () => void,
  onCancel: () => void,
};

// Export this for unit testing more easily
export class AuthFormLoginConfirm extends PureComponent {
  props: Props;

  static defaultProps: {
    user: {},
    error: '',
    confirmPartial: () => {},
    onResendPartial: () => {},
    onCancel: () => {},
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
  handlerClickLogin = (e) => {
    const { state, props } = this;
    const { confirmPartial } = props;
    const { verificationCode } = state;
    e.preventDefault();
    confirmPartial(verificationCode, state.user)
      .then((user) => {
        console.log(user);
      })
      .catch((error) => {
        this.setState({ error });
      });
  };

  handlerClickResend = (e) => {
    const { state, props } = this;
    const { onResendPartial } = props;
    e.preventDefault();
    onResendPartial(state.user)
      .then((user) => {
        console.log(user);
        this.setState({ error: 'Code resent' });
      })
      .catch((error) => {
        this.setState({ error });
      });
  }

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
      return <p className="text-muted">A confirmation code has been sent to your email address</p>;
    }

    return <p className="text-danger">{error}</p>;
  }

  renderUserList = (): Element<any> => {
    const { handlerClickLogin, handlerClickCancel, handleChangeCode, getSubTitle, handlerClickResend } = this; // eslint-disable-line max-len
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
                <Col xs="9">
                  <Button color="primary" className="px-3 mr-3 mb-3" onClick={handlerClickLogin} >Confirm</Button>
                  <Button color="secondary" className="px-3 mb-3" onClick={handlerClickResend} >Resend</Button>
                </Col>
                <Col xs="3" className="text-right">
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

const confirm = (verificationCode, user, dispatch) =>
  new Promise((resolve, reject) => {
    user.confirmRegistration(verificationCode, true, (error) => {
      if (error) {
        dispatch(actionCognito.confirmFailed(user));
        reject(error.message);
      } else {
        dispatch(actionCognito.partialLogout());
        resolve(user);
      }
    });
  });

const resend = (user, dispatch) =>
  new Promise((resolve, reject) => {
    user.resendConfirmationCode((err) => {
      if (err) {
        dispatch(actionCognito.confirmationRequired(user));
        reject(err.message);
      } else {
        dispatch(actionCognito.confirmationRequired(user));
        resolve(user);
      }
    });
  });

const connector: Connector<{}, Props> = connect(
  ({ login, cognito }: Reducer) => (
    { login, user: cognito.user, error: cognito.error }
  ),
  (dispatch: Dispatch) => ({
    onCancel: () => dispatch(actionCognito.logout()),
    confirmPartial: (verificationCode, user) => confirm(verificationCode, user, dispatch),
    onResendPartial: user => resend(user, dispatch),
  }),
);

export default connector(AuthFormLoginConfirm);
