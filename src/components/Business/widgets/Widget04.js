/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { Card, CardBlock, Row, Col } from 'reactstrap';
import classNames from 'classnames';
import { mapToCssModules } from 'reactstrap/lib/utils';

type Props = {
  header: string,
  headertwo: string,
  color: string,
  value: string,
  children: string,
  invert: Boolean,
  className: string,
  cssModule: Object,
};

// Export this for unit testing more easily
export class Widget04 extends PureComponent {
  props: Props;

  static defaultProps: {
    header: '87.500',
    headertwo: '87.500',
    color: 'info',
    value: "25",
    children: "Visitors",
    invert: false
  };

  componentDidMount() { }

  renderWidget = (): Element<any> => {
    const { props } = this;
    const { className, cssModule, header, headertwo, children, invert, ...attributes } = this.props;

    // demo purposes only
    const progress = { style: '', color: props.color, value: props.value };
    const card = { style: '', bgColor: '' };

    if (invert) {
      progress.style = 'progress-white';
      progress.color = '';
      card.style = 'text-white';
      card.bgColor = 'bg-' + props.color; // eslint-disable-line prefer-template
    }

    const classes = mapToCssModules(classNames(className, card.style, card.bgColor), cssModule);
    return (
      <Card className={classes} {...attributes}>
        <CardBlock className="card-body">
          <div className="h6 text-muted text-right mb-2">
            <div className="d-inline-block mr-2">{children}</div>
          </div>
          <Row>
            <Col>
              <div className="h4 mb-0 text-success">{header}</div>
              <small className="text-muted text-uppercase font-weight-bold">Ganancias</small>
            </Col>
            <Col>
              <div className="h4 mb-0 text-danger">{headertwo}</div>
              <small className="text-muted text-uppercase font-weight-bold">Gastos</small>
            </Col>
          </Row>
        </CardBlock>
      </Card>
    );
  }

  render() {
    const { renderWidget } = this;
    return (
      renderWidget()
    );
  }
}

const connector: Connector<{}, Props> = connect(
  () => ({}),
  () => ({}),
);

export default connector(Widget04);
