/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { UncontrolledAlert } from 'reactstrap';

type Props = {
  msj: string,
  color: string,
};

// Export this for unit testing more easily
export class AlertExample extends PureComponent {
  props: Props;

  static defaultProps: {
    msj: '',
    color: '',
  };

  componentDidMount() { }

  renderAlert = (): Element<any> => {
    const { msj, color } = this.props;
    return (
      <UncontrolledAlert color={color}>
        {msj}
      </UncontrolledAlert>
    );
  }

  render() {
    const { renderAlert } = this;
    return (
      renderAlert()
    );
  }
}

const connector: Connector<{}, Props> = connect(
  () => ({}),
  () => ({}),
);

export default connector(AlertExample);
