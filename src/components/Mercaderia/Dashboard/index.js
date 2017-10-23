/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { Row, Col } from 'reactstrap';
import moment from 'moment';
import 'moment/locale/es';
import ReactLoading from 'react-loading';

import type { Reducer, Dispatch } from '../../../types';
import { sortLocal, getWeekNumber, cloneArray, utilDynamicSort, cloneArrayMax, utilToMoney } from '../../../utils/appUtils';
import * as actionFetch from '../../../utils/fetch/action';
import WidgetDos from '../widgets/Widget02';
import WidgetCuatro from '../widgets/Widget04';

type Props = {
  mercalist: Object,
  combolist: Object,
  cuentalist: Object,
  idlocal: Number,
  getLists: () => void,
  infoload: Boolean,
};

// Export this for unit testing more easily
export class Dashboard extends PureComponent {
  props: Props;

  static defaultProps: {
    idlocal: '',
    mercalist: {},
    combolist: {},
    cuentalist: {},
    getLists: () => {},
    infoload: false,
  };

  state = {
    combolist: this.props.combolist,
    mercalist: this.props.mercalist,
    cuentalist: this.props.cuentalist,
    titlemonth: '',
    valormonth: '',
    valorweek: '',
    infoload: false,
  }

  componentDidMount() {
    this.loadAllData();
    this.loadinfo(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { combolist, mercalist, cuentalist } = this.state;
    const newobj = { };
    let sendok = false;

    if (combolist !== nextProps.combolist) {
      sendok = true;
      newobj.combolist = nextProps.combolist;
    }

    if (mercalist !== nextProps.mercalist) {
      sendok = true;
      newobj.mercalist = nextProps.mercalist;
    }

    if (cuentalist !== nextProps.cuentalist) {
      sendok = true;
      newobj.cuentalist = nextProps.cuentalist;
    }

    if (sendok === true) {
      this.loadinfo(nextProps, newobj);
    }
  }

  loadAllData = () => {
    const { getLists } = this.props;
    getLists(actionFetch.goGetCuentasParam(0));
    getLists(actionFetch.goGetMercaderiaParam(this.props.idlocal, 1));
    getLists(actionFetch.goGetMercaderiaComboParam(1, this.props.idlocal, 2));
  }

  loadinfo = (props, newobj) => {
    let _objestate = {};
    if (newobj) {
      _objestate = newobj;
    }

    const { infoload } = this.state;
    if (infoload !== props.infoload) {
      _objestate.infoload = props.infoload;

      if (infoload === true && props.infoload === false) {
        this.loadAllData();
      }
    }

    const d = new Date();
    const objmomemes = moment(d);
    _objestate.titlemonth = 'Gastos ' + objmomemes.format('MMMM').toLocaleUpperCase(); // eslint-disable-line prefer-template

    if (props.combolist.length > 0) {
      let valormonth = 0;
      let valorweek = 0;
      const dweek = getWeekNumber(d);

      const arrcombolist = cloneArray(props.combolist);
      arrcombolist.sort(utilDynamicSort('-date'));
      const n = arrcombolist.length;
      let i;
      for (i = 0; i < n; i += 1) {
        const dtemp = new Date();
        dtemp.setTime(arrcombolist[i].date);
        const dtweek = getWeekNumber(dtemp);

        if (dtemp.getMonth === d.getMonth && dtemp.getFullYear === d.getFullYear) {
          valormonth += arrcombolist[i].valor;
        }

        if (dtweek[1] === dweek[1] && dtemp.getMonth === d.getMonth && dtemp.getFullYear === d.getFullYear) { // eslint-disable-line max-len
          valorweek += arrcombolist[i].valor;
        }
      }
      _objestate.valormonth = valormonth;
      _objestate.valorweek = valorweek;
    } else {
      _objestate.valormonth = 0;
      _objestate.valorweek = 0;
    }

    if (props.mercalist.length > 0) {
      let arrmercazero = cloneArray(props.mercalist);
      arrmercazero.sort(utilDynamicSort('cantidad'));
      arrmercazero = cloneArrayMax(arrmercazero, 3);
      _objestate.mercalist = arrmercazero;
    } else {
      _objestate.mercalist = [];
    }

    this.setState(_objestate);
  }

  componentWillUnmount() { }

  renderUserList = (): Element<any> => {
    const { infoload } = this.props;
    const { mercalist, titlemonth, valormonth, valorweek } = this.state;

    if (infoload !== true) {
      return (
        <div className="pt-3 pb-3">
          <ReactLoading type="spin" delay={0} color="#97b0c1" height={30} width={30} />
        </div>
      );
    }
    /* eslint-disable max-len */
    return (
      <div className="animated fadeIn">
        <div className="mb-2">
          <small className="text-muted text-uppercase font-weight-bold">Mercaderia</small>
        </div>
        <Row>
          <Col xs="12" sm="6" lg="6">
            <WidgetCuatro header={utilToMoney(valormonth)} mainText={titlemonth} icon="fa fa-money" color="danger" variant="1" />
          </Col>
          <Col xs="12" sm="6" lg="6">
            <WidgetCuatro header={utilToMoney(valorweek)} mainText="Gastos Semana" icon="fa fa-money" color="danger" variant="1" />
          </Col>
        </Row>
        <div className="mb-2">
          <small className="text-muted text-uppercase font-weight-bold">Stock</small>
        </div>
        <Row>
          {mercalist.map(itemcombo => (
            <Col xs="12" sm="6" lg="4" key={itemcombo.idmerca}>
              <WidgetDos header={itemcombo.cantidad} unity={itemcombo.unidad} mainText={itemcombo.nametarget.toUpperCase()} color="success" variant="1" />
            </Col>
          ))
          }
        </Row>
      </div>
    );
    /* eslint-enable max-len */
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
  if (utilfetch.mercaderia.data !== undefined && utilfetch.mercaderiacombo.data !== undefined && utilfetch.cuentas.data !== undefined) { // eslint-disable-line max-len
    _infoload = true;
  }

  const props = {
    idlocal: local.id,
    mercalist: sortLocal(utilfetch.mercaderia.data, local.id),
    combolist: sortLocal(utilfetch.mercaderiacombo.data, local.id),
    cuentalist: utilfetch.cuentas.data,
    infoload: _infoload,
  };

  return props;
};

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  (dispatch: Dispatch) => ({
    getLists: (_param:Object) => dispatch(actionFetch.addData(_param)),
  }),
);

export default connector(Dashboard);
