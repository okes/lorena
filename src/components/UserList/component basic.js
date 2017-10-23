/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import type { Auth as AuthType, Reducer } from '../../../types';

type Props = {
  auth: AuthType,
};

// Export this for unit testing more easily
export class Widget02 extends PureComponent {
  props: Props;

  static defaultProps: {
    auth: {},
  };

  componentDidMount() { }

  renderWidget = (): Element<any> => {
    const { props } = this;
    console.log(props);
    return (
      <div>
        <div>chao</div>
      </div>
    );
  }

  render() {
    const { renderWidget } = this;
    const { auth } = this.props;
    return (
      (auth.signedIn) ? renderWidget() : null
    );
  }
}

const connector: Connector<{}, Props> = connect(
  ({ auth }: Reducer) => ({ auth }),
  () => ({}),
);

export default connector(Widget02);
