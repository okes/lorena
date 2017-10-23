/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Nav, NavItem, NavbarToggler, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';

import type { Auth as AuthType, Cognito as CognitoType, Dispatch, Reducer } from '../../../types';
import actionCognito from '../../../utils/cognito/actions';
import { logout as AuthLogout } from '../../../containers/Auth/action';

type Props = {
  auth: AuthType,
  cognito: CognitoType,
  logoutNow: () => void,
  logoutAuthNow: () => void,
  history: PropTypes.object.isRequired,
};

// Export this for unit testing more easily
export class HeaderAdmin extends PureComponent {
  props: Props;

  static defaultProps: {
    auth: {},
    cognito: {},
    router: {},
    logoutNow: () => {},
    logoutAuthNow: () => {},
  };

  state = {
    dropdownOpen: false,
    username: this.props.cognito.username,
  };

  componentDidMount() { }

  componentWillReceiveProps(nextPros) {
    const { username } = this.state;
    if (nextPros.cognito.user && nextPros.cognito.user.username) {
      if (username !== nextPros.cognito.user.username) {
        this.setState({ username: nextPros.cognito.user.username });
      }
    }
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  clickLogout = (e) => {
    e.preventDefault();
    const { cognito, logoutNow, logoutAuthNow, history } = this.props;
    cognito.user.signOut();
    logoutNow();
    logoutAuthNow();
    history.push('/');
  }

  sidebarMinimize = (e) => {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  sidebarToggle = (e) => {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  renderUserList = (): Element<any> => {
    const { toggle, sidebarToggle, mobileSidebarToggle, clickLogout } = this;
    const { dropdownOpen, username } = this.state;

    return (
      <header className="app-header navbar">
        <NavbarToggler className="d-lg-none" onClick={mobileSidebarToggle}>&#9776;</NavbarToggler>
        <Link className="navbar-brand" to={'/'}>
          <img src={require('./assets/logo.svg')} alt="Logo" role="presentation" />
        </Link>
        <NavbarToggler className="d-md-down-none mr-auto" onClick={sidebarToggle}>&#9776;</NavbarToggler>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle className="nav-link dropdown-toggle">
                <span>{username}</span>
              </DropdownToggle>
              <DropdownMenu right className={dropdownOpen ? 'show' : ''}>
                <DropdownItem onClick={clickLogout} ><i className="fa fa-lock" /> Logout</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavItem>
        </Nav>
      </header>
    );
  }

  render() {
    const { renderUserList } = this;
    const { auth } = this.props;
    return (
      (auth.signedIn) ? renderUserList() : null
    );
  }
}

const connector: Connector<{}, Props> = connect(
  ({ auth, cognito, router }: Reducer) => ({ auth, cognito, router }),
  (dispatch: Dispatch) => ({
    logoutNow: () => dispatch(actionCognito.logout()),
    logoutAuthNow: () => dispatch(AuthLogout()),
  }),
);

export default withRouter(connector(HeaderAdmin));
