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
import { cloneArrayMax, sortLocal, getWeekNumber, cloneArray, utilDynamicSort, utilToMoney } from '../../../utils/appUtils';
import * as actionFetch from '../../../utils/fetch/action';
import WidgetDos from '../widgets/Widget02';
import WidgetCuatro from '../widgets/Widget04';

type Props = {
  cuotaslist: Object,
  gananciaslist: Object,
  gastoslist: Object,
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
    cuotaslist: {},
    gananciaslist: {},
    gastoslist: {},
    cuentalist: {},
    getLists: () => {},
    infoload: false,
  };

  state = {
    cuotaslist: this.props.cuotaslist,
    gananciaslist: this.props.gananciaslist,
    gastoslist: this.props.gastoslist,
    cuentalist: this.props.cuentalist,
    infoload: this.props.infoload,
    porvencerlist: [],
    titleayer: '',
    titlemonth: '',
    valormonth: '',
    valorweek: '',
    valorayer: '',
    valormonthg: '',
    valorweekg: '',
    valorayerg: '',
  }

  componentDidMount() {
    this.loadAllData();
    this.loadinfo(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { cuotaslist, gananciaslist, gastoslist, cuentalist } = this.state;
    const newobj = { };
    let sendok = false;

    if (cuotaslist !== nextProps.cuotaslist) {
      sendok = true;
      newobj.cuotaslist = nextProps.cuotaslist;
    }

    if (gananciaslist !== nextProps.gananciaslist) {
      sendok = true;
      newobj.gananciaslist = nextProps.gananciaslist;
    }

    if (gastoslist !== nextProps.gastoslist) {
      sendok = true;
      newobj.gastoslist = nextProps.gastoslist;
    }

    if (cuentalist !== nextProps.cuentalist) {
      sendok = true;
      newobj.cuentalist = nextProps.cuentalist;
    }

    if (sendok === true) {
      this.loadinfo(nextProps, newobj);
    }
  }

  componentWillUnmount() { }

  componentDidUpdate() { }

  loadAllData = () => {
    const { getLists } = this.props;

    getLists(actionFetch.goGetCuentasParam(0));
    getLists(actionFetch.goGetFinanzasGananciasParam(this.props.idlocal, 1));
    getLists(actionFetch.goGetFinanzasGastosParam(this.props.idlocal, 2));
    getLists(actionFetch.goGetFinanzasCuotasParam(this.props.idlocal, 3));
  }

  loadinfo = (props, newobj) => {
    const { infoload } = this.state;
    let _objestate = {};
    if (newobj) {
      _objestate = newobj;
    }

    if (infoload !== props.infoload) {
      _objestate.infoload = props.infoload;

      if (infoload === true && props.infoload === false) {
        this.loadAllData();
      }
    }

    const d = new Date();
    const dweek = getWeekNumber(d);
    const afterday = moment(d).add(-1, 'days')._d;
    const objmome = moment(d).add(-1, 'days');
    _objestate.titleayer = objmome.format('dddd DD').toLocaleUpperCase();

    const objmomemes = moment(d);
    _objestate.titlemonth = objmomemes.format('MMMM').toLocaleUpperCase();

    if (props.gananciaslist.length > 0) {
      let valormonth = 0;
      let valorweek = 0;
      let valorayer = 0;

      const arrcombolist = cloneArray(props.gananciaslist);
      arrcombolist.sort(utilDynamicSort('-date'));
      const n = arrcombolist.length;
      let i;
      for (i = 0; i < n; i += 1) {
        const dtemp = new Date();
        dtemp.setTime(arrcombolist[i].date);
        const dtweek = getWeekNumber(dtemp);
        const aftertday = moment(dtemp).add(-1, 'days')._d;

        if (dtemp.getMonth === d.getMonth && dtemp.getFullYear === d.getFullYear) {
          valormonth += arrcombolist[i].valor;
        }

        if (dtweek[1] === dweek[1] && dtemp.getMonth === d.getMonth && dtemp.getFullYear === d.getFullYear) { // eslint-disable-line max-len
          valorweek += arrcombolist[i].valor;
        }

        if (aftertday.getDay === afterday.getDay && dtemp.getMonth === d.getMonth && dtemp.getFullYear === d.getFullYear) { // eslint-disable-line max-len
          valorayer += arrcombolist[i].valor;
        }
      }
      _objestate.valormonth = valormonth;
      _objestate.valorweek = valorweek;
      _objestate.valorayer = valorayer;
    } else {
      _objestate.valormonth = 0;
      _objestate.valorweek = 0;
      _objestate.valorayer = 0;
    }

    if (props.gastoslist.length > 0) {
      let valormonthg = 0;
      let valorweekg = 0;
      let valorayerg = 0;

      const arrcombolistg = cloneArray(props.gastoslist);
      arrcombolistg.sort(utilDynamicSort('-date'));
      const n = arrcombolistg.length;
      let i;
      for (i = 0; i < n; i += 1) {
        const dtemp = new Date();
        dtemp.setTime(arrcombolistg[i].date);
        const dtweek = getWeekNumber(dtemp);
        const aftertday = moment(dtemp).add(-1, 'days')._d;

        if (dtemp.getMonth === d.getMonth && dtemp.getFullYear === d.getFullYear) {
          valormonthg += arrcombolistg[i].valor;
        }

        if (dtweek[1] === dweek[1] && dtemp.getMonth === d.getMonth && dtemp.getFullYear === d.getFullYear) { // eslint-disable-line max-len
          valorweekg += arrcombolistg[i].valor;
        }

        if (aftertday.getDay === afterday.getDay && dtemp.getMonth === d.getMonth && dtemp.getFullYear === d.getFullYear) { // eslint-disable-line max-len
          valorayerg += arrcombolistg[i].valor;
        }
      }
      _objestate.valormonthg = valormonthg;
      _objestate.valorweekg = valorweekg;
      _objestate.valorayerg = valorayerg;
    } else {
      _objestate.valormonthg = 0;
      _objestate.valorweekg = 0;
      _objestate.valorayerg = 0;
    }

    if (props.cuotaslist.length > 0) {
      let arrmercazero = cloneArray(props.cuotaslist);
      arrmercazero.sort(utilDynamicSort('date'));
      arrmercazero = cloneArrayMax(arrmercazero, 3);
      _objestate.porvencerlist = arrmercazero;
    } else {
      _objestate.porvencerlist = [];
    }

    this.setState(_objestate);
  }

  getDate = (newdate) => {
    const newda = new Date();
    newda.setTime(newdate);
    return String(moment(newda).fromNow() + ' (' + moment(newda).format('L') + ')'); // eslint-disable-line prefer-template
  }

  renderUserList = (): Element<any> => {
    const { porvencerlist, valormonth, valorweek, valorayer, valormonthg, valorweekg, valorayerg, titlemonth, titleayer } = this.state; // eslint-disable-line max-len
    const { getDate } = this;
    const { infoload } = this.props;
    if (infoload !== true) {
      return (
        <ReactLoading type="spin" delay={0} color="#97b0c1" height={30} width={30} />
      );
    }

    return (
      <div className="animated fadeIn">
        <div className="mb-2">
          <small className="text-muted text-uppercase font-weight-bold">Finanzas</small>
        </div>
        <Row>
          <Col xs="12" sm="6" lg="4">
            <WidgetCuatro header={utilToMoney(valormonth)} headertwo={utilToMoney(valormonthg)} value="25">{titlemonth}</WidgetCuatro>
          </Col>
          <Col xs="12" sm="6" lg="4">
            <WidgetCuatro header={utilToMoney(valorweek)} headertwo={utilToMoney(valorweekg)} value="25">SEMANA</WidgetCuatro>
          </Col>
          <Col xs="12" sm="6" lg="4">
            <WidgetCuatro header={utilToMoney(valorayer)} headertwo={utilToMoney(valorayerg)} value="25">{titleayer}</WidgetCuatro>
          </Col>
        </Row>
        {(porvencerlist.length === 0) ? '' : <div>
          <div className="mb-2">
            <small className="text-muted text-uppercase font-weight-bold">Por Vencer</small>
          </div>
          <Row>
            {porvencerlist.map(itemcombo => (
              <Col xs="12" sm="6" lg="4" key={itemcombo.cuotaid}>
                <WidgetDos header={utilToMoney(itemcombo.valor)} mainText={getDate(itemcombo.date)} color="danger" variant="1" />
              </Col>
            ))}
          </Row>
        </div>
        }
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
  if (utilfetch.finanzas_cuotas.data !== undefined && utilfetch.finanzas_ganancias.data !== undefined && utilfetch.finanzas_gastos.data !== undefined) { // eslint-disable-line max-len
    _infoload = true;
  }

  const props = {
    idlocal: local.id,
    cuotaslist: sortLocal(utilfetch.finanzas_cuotas.data, local.id),
    gananciaslist: sortLocal(utilfetch.finanzas_ganancias.data, local.id),
    gastoslist: sortLocal(utilfetch.finanzas_gastos.data, local.id),
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
