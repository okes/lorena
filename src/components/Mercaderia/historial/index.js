/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import type { Connector } from 'react-redux';
import { Row, Col, Card, CardBlock, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactLoading from 'react-loading';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/es';

import type { Reducer, Dispatch } from '../../../types';
import * as actionFetch from '../../../utils/fetch/action';
import * as actionNotification from '../../../utils/notification/action';
import { utilDynamicSort, getCuentas, sortLocal, utilGetObjetForId, utilToMoney, getRandomInt } from '../../../utils/appUtils';

type Props = {
  idlocal: Number,
  cuentalist: Object,
  mercalist: Object,
  mercalistcombo: Object,
  mercalistcomboquitar: Object,
  getLists: () => void,
  goSendData: () => void,
  goSendNotification: () => void,
  goDeleteData: () => void,
  infoload: Boolean,
  extra: Object,
  history: PropTypes.object.isRequired,
};
// Export this for unit testing more easily
export class HistoriaMercaderia extends PureComponent {
  props: Props;

  static defaultProps: {
    idlocal: '',
    list: [],
    cuentalist: {},
    mercalist: {},
    mercalistcombo: {},
    mercalistcomboquitar: {},
    getLists: () => {},
    goSendData: () => {},
    goSendNotification: () => {},
    goDeleteData: () => {},
    infoload: false,
    extra: {},
  };

  state = {
    cuentalist: this.props.cuentalist,
    list: [],
    modaldelete: false,
    modaldeleteItem: {},
    modalitemtype: {},
    sendingload: false,
    infoload: false,
  }

  componentDidMount() {
    this.loadAllData();
    this.loadinfo(this.props);
  }

  componentWillMount() { }

  componentWillReceiveProps(nextProps) {
    const { cuentalist, mercalist, mercalistcombo, mercalistcomboquitar } = this.state;
    const newobj = { };
    let sendok = false;

    if (cuentalist !== nextProps.cuentalist) {
      sendok = true;
      newobj.cuentalist = nextProps.cuentalist;
    }
    if (mercalist !== nextProps.mercalist) {
      sendok = true;
      newobj.mercalist = nextProps.mercalist;
    }
    if (mercalistcombo !== nextProps.mercalistcombo) {
      sendok = true;
      newobj.mercalistcombo = nextProps.mercalistcombo;
    }
    if (mercalistcomboquitar !== nextProps.mercalistcomboquitar) {
      sendok = true;
      newobj.mercalistcomboquitar = nextProps.mercalistcomboquitar;
    }

    if (sendok === true) {
      this.loadinfo(nextProps, newobj);
    }
  }

  componentWillUnmount() { }

  loadAllData = () => {
    const { getLists, idlocal } = this.props;
    getLists(actionFetch.goGetCuentasParam(0));
    getLists(actionFetch.goGetMercaderiaParam(idlocal, 1));
    getLists(actionFetch.goGetMercaderiaComboParam(1, idlocal, 1));
    getLists(actionFetch.goGetMercaderiaComboParam(0, idlocal, 1));
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

    _objestate.list = this.getListMerca(props.mercalistcombo, props.mercalistcomboquitar);
    this.setState(_objestate);
  }

  checkAddNewObjectList= (iddata, arrdata) => {
    const n = arrdata.length;
    if (n > 0) {
      let i;
      for (i = 0; i < n; i += 1) {
        if (arrdata[i].keydate === iddata) {
          return i;
        }
      }
    }
    return true;
  }

  getListMerca = (ganancias, gastos) => {
    if (ganancias && gastos) {
      ganancias.sort(utilDynamicSort('-date'));
      const n = ganancias.length;
      const arrTodo = [];
      let i;
      for (i = 0; i < n; i += 1) {
        const tempdate = new Date(ganancias[i].date);
        const _keydate = String(tempdate.getDate() + '' + tempdate.getMonth() + '' + tempdate.getFullYear()); // eslint-disable-line prefer-template
        const _keysolo = getRandomInt(1000, tempdate.getTime()) + tempdate.getTime();
        let algon = this.checkAddNewObjectList(_keydate, arrTodo);
        if (algon === true) {
          arrTodo.push({ keydate: _keydate, date: ganancias[i].date, list: [], key: _keysolo });
          algon = this.checkAddNewObjectList(_keydate, arrTodo);
        }
        const _keysolodos = getRandomInt(1000, tempdate.getTime()) + tempdate.getTime();
        const objtemp = { n: i, obj: ganancias[i], type: 'add', key: _keysolodos };
        arrTodo[algon].list.push(objtemp);
      }

      gastos.sort(utilDynamicSort('-date'));
      const m = gastos.length;
      let j;
      for (j = 0; j < m; j += 1) {
        const tempdate = new Date(gastos[j].date);
        const _keydate = String(tempdate.getDate() + '' + tempdate.getMonth() + '' + tempdate.getFullYear()); // eslint-disable-line prefer-template
        const _keysolo = getRandomInt(1000, tempdate.getTime()) + tempdate.getTime();
        let algon = this.checkAddNewObjectList(_keydate, arrTodo);
        if (algon === true) {
          arrTodo.push({ keydate: _keydate, date: gastos[j].date, list: [], key: _keysolo });
          algon = this.checkAddNewObjectList(_keydate, arrTodo);
        }
        const _keysolodos = getRandomInt(1000, tempdate.getTime()) + tempdate.getTime();
        const objtemp = { n: j, obj: gastos[j], type: 'quitar', key: _keysolodos };
        arrTodo[algon].list.push(objtemp);
      }
      arrTodo.sort(utilDynamicSort('-date'));
      return arrTodo;
    }

    return [];
  }

  toggleDeleteAlerta = (forceclose) => {
    const { sendingload } = this.state;
    if (!sendingload || forceclose) {
      const objset = {
        modaldelete: !this.state.modaldelete,
        modaldeleteItem: {},
        modalitemtype: {},
      };
      if (forceclose) {
        objset.sendingload = false;
      }
      this.setState(objset);
    }
  };

  handleClickDelete = (_item, typeitem) => {
    this.setState({
      modaldelete: !this.state.modaldelete,
      modaldeleteItem: _item,
      modalitemtype: typeitem,
    });
  };

  getDate = (newdate) => {
    const newda = new Date(newdate);
    return String(moment(newda).format('dddd') + ' ' + moment(newda).format('LL')).toLocaleUpperCase(); // eslint-disable-line prefer-template
  };

  handleClickUpdate = (_item) => {
    const { history } = this.props;
    const urlbase = '/finanzas/cuentas/editar-cuenta/';
    history.push(urlbase + _item.idtarget);
  }

  getListQuitar = (comboj, j, _itemobjdele) => {
    const { mercalist } = this.props;
    let classbg = 'grid-bg-itemone pl-3 pt-1 pb-1';
    if (j % 2 === 1) {
      classbg = 'grid-bg-itemtwo pl-3 pt-1 pb-1';
    }

    return (
      <Row key={j} className={classbg}>
        <Col xs="11" sm="11" lg="11" className="p-1">
          <div>{utilGetObjetForId(mercalist, comboj.mercaid, 'idmerca', 'nametarget').toLocaleUpperCase()}</div>
          <div className="text-danger">
            <small className="d-inline-block mr-2">{comboj.cantidad}</small>
            <small className="d-inline-block">{utilGetObjetForId(mercalist, comboj.mercaid, 'idmerca', 'unidad').toLocaleLowerCase()}</small>
          </div>
        </Col>
        <Col xs="1" sm="1" lg="1" className="p-1">
          <a className="nav-link d-inline-block pt-2 pb-0 float-right" onClick={() => this.handleClickDelete(comboj, _itemobjdele)} role="button" tabIndex="0">
            <i className="fa fa-trash-o icons font-2xl d-block" />
          </a>
        </Col>
      </Row>
    );
  };

  getListAdd = (comboj, j, _itemobjdele) => {
    const { cuentalist, mercalist } = this.props;
    let classbg = 'grid-bg-itemone pl-3 pt-1 pb-1';
    if (j % 2 === 1) {
      classbg = 'grid-bg-itemtwo pl-3 pt-1 pb-1';
    }

    return (
      <Row key={j} className={classbg}>
        <Col xs="6" sm="6" lg="6" className="p-1">
          <div>{utilGetObjetForId(mercalist, comboj.mercaid, 'idmerca', 'nametarget').toLocaleUpperCase()}</div>
          <div className="text-success">
            <small className="d-inline-block mr-2">{comboj.cantidad}</small>
            <small className="d-inline-block">{utilGetObjetForId(mercalist, comboj.mercaid, 'idmerca', 'unidad').toLocaleLowerCase()}</small>
          </div>
        </Col>
        <Col xs="5" sm="5" lg="5" className="p-1">
          <div>{utilGetObjetForId(cuentalist, comboj.idtarget, 'idtarget', 'nametarget').toLocaleUpperCase()}</div>
          <div className="text-danger">{utilToMoney(comboj.valor)}</div>
        </Col>
        <Col xs="1" sm="1" lg="1" className="p-1">
          <a className="nav-link d-inline-block pt-2 pb-0 float-right" onClick={() => this.handleClickDelete(comboj, _itemobjdele)} role="button" tabIndex="0">
            <i className="fa fa-trash-o icons font-2xl d-block" />
          </a>
        </Col>
      </Row>
    );
  };

  getTableList = item => (
    <div key={item.key} >
      <small className="row pl-3 mt-3 pb-2 mb-0 text-muted text-uppercase font-weight-bold">{this.getDate(item.date)}</small>
      {item.list.map((itemii, i) => {
        const asdasd = true;
        if (!asdasd) {
          console.log(itemii);
        }
        let classkeydiv = '';
        if (i > 0) {
          classkeydiv = 'pt-2';
        }
        /* eslint-disable no-mixed-operators */
        return (
          <div key={itemii.key} className={classkeydiv}>
            {(itemii.obj.note && itemii.obj.note !== '' || itemii.obj.valor && itemii.obj.valor !== '') ? <Row className="pl-3 pt-2 pb-1">
              <Col className="pl-1" >{itemii.obj.note}</Col>
              <Col xs="4" sm="4" lg="4" className="float-right text-right">{(!isNaN(itemii.obj.valor)) ? utilToMoney(itemii.obj.valor) : null}</Col>
            </Row> : <Row /> }
            <div>
              {(itemii.type === 'quitar') ? itemii.obj.combo.map((comboj, j) => this.getListQuitar(comboj, j, { type: 0, date: itemii.obj.date })) : null}
              {(itemii.type === 'add') ? itemii.obj.combo.pv.map((comboj, j) => this.getListAdd(comboj, j, { type: 1, date: itemii.obj.date })) : null}
              {(itemii.type === 'add') ? itemii.obj.combo.gasto.map((comboj, j) => this.getListAdd(comboj, j, { type: 1, date: itemii.obj.date })) : null}
            </div>
          </div>
        );
        /* eslint-enable no-mixed-operators */
      })}
    </div>
  )

  renderUserList = (): Element<any> => {
    const { infoload, extra, goSendData, goSendNotification, goDeleteData, getLists, idlocal, history } = this.props; // eslint-disable-line max-len
    const { getTableList, toggleDeleteAlerta } = this;
    const { list, modaldelete, modaldeleteItem, sendingload, modalitemtype } = this.state;
    if (infoload !== true || !list) {
      return (
        <ReactLoading type="spin" delay={0} color="#97b0c1" height={30} width={30} />
      );
    }

    const asdasd = true;
    if (!asdasd) {
      console.log(idlocal);
      history.push('/mercaderia/lista/nueva-mercaderia');
    }

    const toggleDeleteAlertaOK = () => {
      if (modaldeleteItem) {
        this.setState({ sendingload: true });

        goSendData({
          service: 'aws',
          method: 'mercaderiacombodelete',
          query: {
            date: modalitemtype.date,
            idtype: modalitemtype.type,
          },
        })
          .then((res) => {
            toggleDeleteAlerta(true);
            console.log(res);

            goDeleteData(actionFetch.goGetCuentasDelete());
            goDeleteData(actionFetch.goGetMercaderiaDelete());
            goDeleteData(actionFetch.goGetMercaderiaComboDelete(0));
            goDeleteData(actionFetch.goGetMercaderiaComboDelete(1));
            goSendNotification({ msj: 'Combo Eliminado!' });
            getLists(actionFetch.goGetCuentasParam(0));
            getLists(actionFetch.goGetMercaderiaParam(idlocal, 1));
            getLists(actionFetch.goGetMercaderiaComboParam(1, idlocal, 1));
            getLists(actionFetch.goGetMercaderiaComboParam(0, idlocal, 1));
          })
          .catch((error) => {
            console.log(error);
            console.log('error delete cuenta');
            toggleDeleteAlerta(true);
          });
      }
    };
    /* eslint-disable prefer-template */
    return (
      <div>
        <div className="animated fadeIn">
          <Helmet title={extra.name} />
          <Row>
            <Col xs="12" sm="12" lg="10">
              <Card>
                <CardBlock className="card-body">
                  {(list.length === 0) ? 'No hay datos...' : list.map(item => getTableList(item))}
                </CardBlock>
              </Card>
            </Col>
          </Row>
        </div>
        <Modal isOpen={modaldelete} toggle={toggleDeleteAlerta} className={'modal-sm'}>
          <ModalHeader toggle={toggleDeleteAlerta}>{(sendingload) ? 'Eliminando' : 'Eliminar'}</ModalHeader>
          <ModalBody>
            {(sendingload) ? 'Espere un momento...' : '¿Esta seguro de eliminar?'}
          </ModalBody>
          {(sendingload) ? '' : <ModalFooter>
            <Button color="danger" onClick={toggleDeleteAlertaOK}>Eliminar!</Button>{' '}
            <Button color="secondary" onClick={toggleDeleteAlerta}>Cancelar</Button>
          </ModalFooter>}
        </Modal>
      </div>
    );
    /* eslint-enable prefer-template */
  }

  render() {
    const { renderUserList } = this;
    return (
      renderUserList()
    );
  }
}

const sortCuentas = (_cuentas) => {
  if (_cuentas) {
    return _cuentas.sort(utilDynamicSort('nametarget'));
  }
  return [];
};

const mapStateToProps = ({ utilfetch, local }: Reducer) => {
  let _infoload = false;
  if (utilfetch.cuentas.data !== undefined && utilfetch.mercaderia.data !== undefined && utilfetch.mercaderiacombo.data !== undefined && utilfetch.mercaderiacomboquitar.data !== undefined) { // eslint-disable-line max-len
    _infoload = true;
  }
  const props = {
    idlocal: local.id,
    cuentalist: getCuentas(utilfetch.cuentas.data),
    mercalist: sortCuentas(utilfetch.mercaderia.data),
    mercalistcombo: sortLocal(utilfetch.mercaderiacombo.data, local.id),
    mercalistcomboquitar: sortLocal(utilfetch.mercaderiacomboquitar.data, local.id),
    infoload: _infoload,
  };

  return props;
};

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  (dispatch: Dispatch) => ({
    getLists: (_param:Object) => dispatch(actionFetch.addData(_param)),
    goSendData: (_objsend: Object, _mas:any) => dispatch(actionFetch.goSendData(_objsend, _mas)),
    goSendNotification: (_param:any) => dispatch(actionNotification.sendNotification(_param)),
    goDeleteData: (_name: String) => dispatch(actionFetch.deleteData(_name)),
  }),
);

export default withRouter(connector(HistoriaMercaderia));
