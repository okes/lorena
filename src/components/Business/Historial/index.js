/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import _ from 'lodash';
import type { Element } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Button } from 'reactstrap';

import type { Auth as AuthType, Cognito as CognitoType, Reducer } from '../../../types';

type Props = {
  auth: AuthType,
  cognito: CognitoType,
  history: PropTypes.object.isRequired,
  routes: any,
};

// Export this for unit testing more easily
export class WrapBusiness extends PureComponent {
  props: Props;

  static defaultProps: {
    auth: {},
    cognito: {},
    router: {},
    routes: {},
  };

  componentDidMount() {
    console.log(this.props.cognito);
  }

  renderUserList = (): Element<any> => {
    const { history, routes } = this.props;
    // Use it when sub routes are added to any route it'll work
    const routeWithSubRoutes = route => (
      <Route
        key={_.uniqueId()}
        exact={route.exact || false}
        path={route.path}
        render={props => (
          // Pass the sub-routes down to keep nesting
          <route.component {...props} routes={route.routes || null} extra={route.extra || null} />
        )}
      />
    );
    const clickGananciasygastos = () => {
      history.push('/finanzas/historial');
    };

    const clickPorVencer = () => {
      history.push('/finanzas/historial/por-vencer');
    };

    const asd = true;
    if (!asd) {
      console.log(history);
      console.log(routes);
    }

    return (
      <div>
        <div>
          <Button type="submit" size="sm" color="primary" onClick={clickGananciasygastos}><i className="fa fa-dot-circle-o mr-2" />Ganancias y Gastos</Button>
          <Button type="submit" size="sm" color="primary" onClick={clickPorVencer}><i className="fa fa-dot-circle-o mr-2" />Por Vencer</Button>
        </div>
        <Switch>
          {routes.map(route => routeWithSubRoutes(route))}
        </Switch>
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
  ({ auth, cognito, router }: Reducer) => ({ auth, cognito, router }),
  () => ({ }),
);

export default withRouter(connector(WrapBusiness));
