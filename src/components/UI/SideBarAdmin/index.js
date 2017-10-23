/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Badge, Nav, NavItem, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import classNames from 'classnames';

import type { Auth as AuthType, Local as LocalType, Reducer, Dispatch } from '../../../types';
import { setLocal } from '../../../utils/local/action';
import * as actionFetch from '../../../utils/fetch/action';

type Props = {
  auth: AuthType,
  local: LocalType,
  setNewLocal: () => void,
  goDeleteData: () => void,
};

// Export this for unit testing more easily
export class SideBarAdmin extends PureComponent {
  props: Props;

  static defaultProps: {
    auth: {},
    local: {},
    router: {},
    setNewLocal: () => {},
    goDeleteData: () => {},
  };

  state = {
    modallocal: false,
    modallocalitem: {},
  }

  componentDidMount() { }

  handleClick = (e) => {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  renderUserList = (): Element<any> => {
    const { handleClick, props } = this;
    const { local, setNewLocal, goDeleteData } = this.props;
    const { modallocal } = this.state;

    const arrlist = {
      items: [
        {
          name: 'INICIO',
          url: '/',
          icon: 'icon-speedometer',
        },
        {
          divider: true,
        },
        {
          name: 'FINANZAS',
          icon: 'fa fa-line-chart',
          children: [
            {
              name: 'Agregar Ganancia',
              url: '/finanzas/agregar-ganancia',
              icon: 'icon-puzzle',
            },
            {
              name: 'Agregar Gasto',
              url: '/finanzas/agregar-gasto',
              icon: 'icon-puzzle',
            },
            {
              name: 'Historial',
              url: '/finanzas/historial',
              icon: 'icon-puzzle',
            },
            {
              name: 'Cuentas',
              url: '/finanzas/cuentas',
              icon: 'icon-puzzle',
            },
          ],
        },
        {
          divider: true,
        },
        {
          name: 'MERCADERIA',
          icon: 'icon-star',
          children: [
            {
              name: 'Agregar Mercaderia',
              url: '/mercaderia/agregar-mercaderia',
              icon: 'icon-star',
            },
            {
              name: 'Quitar Mercaderia',
              url: '/mercaderia/quitar-mercaderia',
              icon: 'icon-star',
            },
            {
              name: 'Historial',
              url: '/mercaderia/historial',
              icon: 'icon-star',
            },
            {
              name: 'Mercaderia',
              url: '/mercaderia/lista',
              icon: 'icon-star',
            },
          ],
        },
        {
          divider: true,
        },
        {
          name: 'RRHH',
          icon: 'icon-star',
          children: [
            {
              name: 'Pagar',
              icon: 'icon-star',
              children: [
                {
                  name: 'Pagar Suelo',
                  url: '/rrhh/personal/pagar-sueldo',
                  icon: 'icon-star',
                },
                {
                  name: 'Pagar Adelanto',
                  url: '/rrhh/personal/pagar-adelanto',
                  icon: 'icon-star',
                },
                {
                  name: 'Pagar Extra',
                  url: '/rrhh/personal/pagar-extra',
                  icon: 'icon-star',
                },
              ],
            },
            {
              name: 'Personal',
              url: '/rrhh/personal/lista',
              icon: 'icon-star',
            },
          ],
        },
      ],
    };

    const wrapper = (item) => {
      if (!item.wrapper) {
        return item.name;
      }
      return React.createElement(item.wrapper.element, item.wrapper.attributes, item.name);
    };

    const getbadge = (badge) => {
      if (badge) {
        const classes = classNames(badge.class);
        return (<Badge className={classes} color={badge.variant}>{badge.text}</Badge>);
      }
      return null;
    };

    const handleClickitemchico = () => {
      document.body.classList.toggle('sidebar-mobile-show');
    };

    const navItem = (item, key) => {
      const classes = classNames('nav-link', item.class);
      return (
        <NavItem key={key}>
          <NavLink to={item.url} onClick={handleClickitemchico} className={classes} activeClassName="active">
            <i className={item.icon} />{item.name}{getbadge(item.badge)}
          </NavLink>
        </NavItem>
      );
    };

    const navDropdown = (item, key) => {
      let activeroute = 'nav-item nav-dropdown';
      if (props.router.location.pathname.indexOf(item.url) > -1) {
        activeroute = 'nav-item nav-dropdown open';
      }

      return (
        <li key={key} className={activeroute}>
          <a className="nav-link nav-dropdown-toggle" onClick={handleClick} role="button" tabIndex={key}>
            <i className={item.icon} />{item.name}
          </a>
          <ul className="nav-dropdown-items">
            {navList(item.children)}
          </ul>
        </li>
      );
    };

    const gettitle = (title, key) => {
      if (title.title === true) {
        const classes = classNames('nav-title', title.class);
        return (<li key={key} className={classes}>{wrapper(title)}</li>);
      } else if (title.divider === true) {
        return (<li key={key} className="divider" />);
      }
      return navDropdown(title, key);
    };

    const getNavLink = (item, idx) => (
      (item.title || item.divider || item.children) ? gettitle(item, idx) : navItem(item, idx)
    );

    const navList = items => items.map((item, index) => getNavLink(item, index));

    const toggleLocalSelect = (forceclose) => {
      const { sendingload } = this.state;
      if (!sendingload || forceclose) {
        const objset = {
          modallocal: !this.state.modallocal,
          modallocalitem: {},
        };
        if (forceclose) {
          objset.sendingload = false;
        }
        this.setState(objset);
      }
    };

    const handleClickLocalSelect = (_item) => {
      setNewLocal(_item.id);
      goDeleteData();
      toggleLocalSelect(true);
    };

    const _localname = String(local.list[local.id].name).toLocaleUpperCase();

    const getTableList = (item, i) => {
      let classbtn = 'grid-bg-itemone';
      if (i % 2 === 1) {
        classbtn = 'grid-bg-itemtwo';
      }
      classbtn += ' mb-2';

      let _disabled = false;

      if (item.id === local.id) {
        _disabled = true;
      }

      return (
        <div key={i}>
          <Button className={classbtn} onClick={() => handleClickLocalSelect(item)} disabled={_disabled} block>{item.name}</Button>{' '}
        </div>
      );
    };

    return (
      <div className="sidebar">
        <nav className="sidebar-nav">
          <Nav>
            {navList(arrlist.items)}
            <li key={1} className="divider-line mt-2 mb-2" />
            <li key={0} className="nav-item nav-dropdown">
              <a className="nav-link text-warning" onClick={toggleLocalSelect} role="button" tabIndex={0}>
                <i className="icon-puzzle" />{_localname}
              </a>
            </li>
          </Nav>
        </nav>
        <Modal isOpen={modallocal} toggle={toggleLocalSelect} className={'modal-sm'}>
          <ModalHeader toggle={toggleLocalSelect}>{'Locales'}</ModalHeader>
          <ModalBody>
            {local.list.map((item, i) => getTableList(item, i))}
          </ModalBody>
        </Modal>
      </div>
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
  ({ auth, router, local }: Reducer) => ({ auth, router, local }),
  (dispatch: Dispatch) => ({
    goDeleteData: () => dispatch(actionFetch.resetData()),
    setNewLocal: (_newid: any) => dispatch(setLocal(_newid)),
  }),
);

export default connector(SideBarAdmin);
