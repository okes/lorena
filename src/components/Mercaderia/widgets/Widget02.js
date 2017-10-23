/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { Card, CardBlock, CardFooter } from 'reactstrap';
import classNames from 'classnames';
import { mapToCssModules } from 'reactstrap/lib/utils';

type Props = {
  header: string,
  mainText: string,
  color: string,
  variant: string,
  link: string,
  footer: boolean,
  children: any,
  className: string,
  unity: string,
  cssModule: Object,
};

// Export this for unit testing more easily
export class Widget02 extends PureComponent {
  props: Props;

  static defaultProps: {
    header: '$1,999.50',
    mainText: 'Income',
    color: 'primary',
    variant: "0",
    link: "#",
    unity: '',
  };

  componentDidMount() { }

  renderWidget = (): Element<any> => {
    const { props } = this;
    const { unity, className, cssModule, header, mainText, footer, link, children, variant, ...attributes } = this.props; // eslint-disable-line max-len

    // demo purposes only
    const padding = (variant === '0' ? { card: 'p-3', lead: 'mt-2' } : (variant === '1' ? { // eslint-disable-line no-nested-ternary
      card: 'p-0', lead: 'pt-3' } : { card: 'p-0', lead: 'pt-3' }));

    const card = { style: 'card-body clearfix', color: props.color, classes: '' };
    card.classes = mapToCssModules(classNames(className, card.style, padding.card), cssModule);

    const lead = { style: 'h5 mb-0', color: props.color, classes: '' };
    lead.classes = classNames(lead.style, 'text-' + card.color, padding.lead); // eslint-disable-line prefer-template

    const blockIcon = () => {
      const classes = classNames('bg-' + card.color, 'pt-4 pb-5 pr-2', 'font-2xl mr-3 float-left'); // eslint-disable-line prefer-template
      return (<i className={classes} />);
    };

    const cardFooter = () => ((footer) ? (
      <CardFooter className="px-3 py-2">
        <a className="font-weight-bold font-xs btn-block text-muted" href={link}>View More
          <i className="fa fa-angle-right float-right font-lg" /></a>
      </CardFooter>
    ) : null);

    const valormasunity = header + ' ' + unity; // eslint-disable-line prefer-template
    return (
      <Card>
        <CardBlock className={card.classes} {...attributes}>
          {blockIcon()}
          <div className={lead.classes}>{valormasunity}</div>
          <div className="text-muted text-uppercase font-weight-bold font-xs">{mainText}</div>
        </CardBlock>
        {cardFooter()}
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

export default connector(Widget02);
