/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import type { Connector } from 'react-redux';
import { Row, Col } from 'reactstrap';
import ReactLoading from 'react-loading';

import type { Reducer, Dispatch } from '../../../types';
import * as actionFetch from '../../../utils/fetch/action';

type Props = {
  idlocal: Number,
  cuentalist: Object,
  getLists: () => void,
  infoload: Boolean,
  extra: Object,
};

// Export this for unit testing more easily
export class FormAdd extends PureComponent {
  props: Props;

  static defaultProps: {
    idlocal: '',
    cuentalist: {},
    getLists: () => {},
    infoload: false,
    extra: {},
  };

  state = {
    cuentalist: this.props.cuentalist,
  }

  componentDidMount() {
    const { getLists } = this.props;
    getLists('goGetCuentas', { mas: 0 });
    console.log(this.props.extra);
    console.log(this.props.idlocal);
  }

  componentWillReceiveProps(nextProps) {
    const { cuentalist } = this.state;
    const newobj = { };
    let sendok = false;

    if (cuentalist !== nextProps.cuentalist) {
      sendok = true;
      newobj.cuentalist = nextProps.cuentalist;
    }

    if (sendok === true) {
      this.setState(newobj);
    }
  }

  componentWillUnmount() { }

  renderUserList = (): Element<any> => {
    const { infoload, extra } = this.props;
    if (infoload !== true) {
      return (
        <ReactLoading type="spin" delay={0} color="#97b0c1" height={30} width={30} />
      );
    }

    return (
      <div className="animated fadeIn">
        <Helmet title={extra.name} />
        <div className="mb-2">
          <small className="text-muted text-uppercase font-weight-bold">Finanzas</small>
        </div>
        <Row>
          <Col xs="12" sm="6" lg="4">
            <div>buena etero</div>
          </Col>
        </Row>
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

const mapStateToProps = ({ utilfetch, local }: Reducer) => {
  let _infoload = false;
  if (utilfetch.cuentas.data !== undefined) { // eslint-disable-line max-len
    _infoload = true;
  }

  const props = {
    idlocal: local.id,
    cuentalist: utilfetch.cuentas.data,
    infoload: _infoload,
  };

  return props;
};

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  (dispatch: Dispatch) => ({
    getLists: (_name: String, _param:Object) => dispatch(actionFetch.addData(_name, _param)),
  }),
);

export default connector(FormAdd);
