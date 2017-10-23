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
  icon: string,
  color: string,
  variant: string,
  link: string,
  footer: boolean,
  children: any,
  className: string,
  cssModule: Object,
};

// Export this for unit testing more easily
export class Widget04 extends PureComponent {
  props: Props;

  static defaultProps: {
    header: '$1,999.50',
    mainText: 'Income',
    icon: "fa fa-cogs",
    color: 'primary',
    variant: "0",
    link: "#"
  };

  componentDidMount() { }

  renderWidget = (): Element<any> => {
    const { props } = this;
    const { className, cssModule, header, mainText, footer, link, children, variant, ...attributes } = this.props; // eslint-disable-line max-len

    // demo purposes only
    const padding = (variant === '0' ? { card: 'p-3', icon: 'p-3', lead: 'mt-2' } : (variant === '1' ? { // eslint-disable-line no-nested-ternary
      card: 'p-0', icon: 'p-4', lead: 'pt-3' } : { card: 'p-0', icon: 'p-4 px-5', lead: 'pt-3' }));

    const card = { style: 'card-body clearfix', color: props.color, icon: props.icon, classes: '' };
    card.classes = mapToCssModules(classNames(className, card.style, padding.card), cssModule);

    const lead = { style: 'h5 mb-0', color: props.color, classes: '' };
    lead.classes = classNames(lead.style, 'text-' + card.color, padding.lead); // eslint-disable-line prefer-template

    const blockIcon = (icon) => {
      const classes = classNames(icon, 'bg-' + card.color, padding.icon, 'font-2xl mr-3 float-left'); // eslint-disable-line prefer-template
      return (<i className={classes} />);
    };

    const cardFooter = () => ((footer) ? (
      <CardFooter className="px-3 py-2">
        <a className="font-weight-bold font-xs btn-block text-muted" href={link}>View More
          <i className="fa fa-angle-right float-right font-lg" /></a>
      </CardFooter>
    ) : null);

    return (
      <Card>
        <CardBlock className={card.classes} {...attributes}>
          {blockIcon(card.icon)}
          <div className={lead.classes}>{header}</div>
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

export default connector(Widget04);
