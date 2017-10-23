/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';

import routes from '../../../routes';
import type { Auth as AuthType, Reducer } from '../../../types';

type Props = {
  auth: AuthType,
};

// Export this for unit testing more easily
export class BreadCrumbAdmin extends PureComponent {
  props: Props;

  static defaultProps: {
    auth: {},
    router: {},
  };

  componentDidMount() { }

  renderUserList = (): Element<any> => {
    const { props } = this;

    const BreadcrumbsItem = (item, idx) => {
      const routeName = routes.filter(el => el.path === item)[0];

      if (routeName) {
        return (routeName.exact ?
          (
            <BreadcrumbItem key={idx} active>{routeName.extra.name}</BreadcrumbItem>
          ) :
          (
            <BreadcrumbItem key={idx}>
              <Link to={routeName.path || ''}>
                {routeName.extra.name}
              </Link>
            </BreadcrumbItem>
          )
        );
      }
      return null;
    };

    const getPaths = (pathname) => {
      const paths = ['/'];

      if (pathname === '/') return paths;

      pathname.split('/').reduce((prev, curr) => {
        const currPath = `${prev}/${curr}`;
        paths.push(currPath);
        return currPath;
      });
      return paths;
    };

    const conso = false;

    if (conso) {
      console.log(props.router);
    }

    const paths = getPaths(props.router.location.pathname);

    if (conso) {
      console.log(paths);
    }

    const items = paths.map((path, i) => BreadcrumbsItem(path, i));

    if (conso) {
      console.log(items);
    }

    return (
      <div>
        <Breadcrumb>
          {items}
        </Breadcrumb>
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
  ({ auth, router }: Reducer) => ({ auth, router }),
  () => ({}),
);

export default connector(BreadCrumbAdmin);
