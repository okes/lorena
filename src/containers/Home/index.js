/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import type { Cognito as CognitoType, Reducer } from '../../types';

import BusinessDash from '../../components/Business/Dashboard';
import MercaderiaDash from '../../components/Mercaderia/Dashboard';

type Props = {
  cognito: CognitoType,
  extra: Object,
};

// Export this for unit testing more easily
export class Home extends PureComponent {
  props: Props;

  static defaultProps: {
    cognito: {},
    extra: {},
  };

  state = {
    initnow: false,
  }

  componentDidMount() {
    if (this.props.cognito.state !== 'LOGGED_IN') {
      console.log(this.props.cognito);
    }
  }

  componentWillMount() {
    this.setState({ initnow: true });
  }

  renderUserList = (): Element<any> => {
    const { initnow } = this.state;
    const { extra } = this.props;

    if (!initnow) {
      return null;
    }

    return (
      <div>
        <Helmet title={extra.name} />
        <BusinessDash />
        <MercaderiaDash />
      </div>
    );
  }

  render() {
    const { renderUserList } = this;
    return (
      renderUserList()
    );
  }
}

const connector: Connector<{}, Props> = connect(
  ({ cognito }: Reducer) => ({ cognito }),
  () => ({ }),
);

export default connector(Home);
