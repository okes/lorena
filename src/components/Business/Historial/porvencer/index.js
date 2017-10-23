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

import type { Reducer, Dispatch } from '../../../../types';
import * as actionFetch from '../../../../utils/fetch/action';
import * as actionNotification from '../../../../utils/notification/action';
import { utilDynamicSort, sortLocal, utilGetObjetForId, utilToMoney } from '../../../../utils/appUtils';

type Props = {
  idlocal: Number,
  cuentalist: Object,
  porvencerlist: Object,
  porvenceroklist: Object,
  getLists: () => void,
  goSendData: () => void,
  goSendNotification: () => void,
  goDeleteData: () => void,
  infoload: Boolean,
  extra: Object,
  history: PropTypes.object.isRequired,
};

// Export this for unit testing more easily
export class HistoriaFinanzasPorVencer extends PureComponent {
  props: Props;

  static defaultProps: {
    idlocal: '',
    list: [],
    cuentalist: {},
    porvencerlist: {},
    porvenceroklist: {},
    getLists: () => {},
    goSendData: () => {},
    goSendNotification: () => {},
    goDeleteData: () => {},
    infoload: false,
    extra: {},
  };

  state = {
    cuentalist: this.props.cuentalist,
    porvencerlist: this.props.porvencerlist,
    porvenceroklist: this.props.porvenceroklist,
    modaldelete: false,
    modaldeleteispay: false,
    modaldeleteItem: {},
    sendingload: false,
    infoload: false,
  }

  componentDidMount() {
    this.loadAllData();
    this.loadinfo(this.props);
  }

  componentWillMount() {
    console.log(this.props.extra);
  }

  componentWillReceiveProps(nextProps) {
    const { cuentalist, porvencerlist, porvenceroklist } = this.state;
    const newobj = { };
    let sendok = false;

    if (cuentalist !== nextProps.cuentalist) {
      sendok = true;
      newobj.cuentalist = nextProps.cuentalist;
    }
    if (porvencerlist !== nextProps.porvencerlist) {
      sendok = true;
      newobj.porvencerlist = nextProps.porvencerlist;
    }
    if (porvenceroklist !== nextProps.porvenceroklist) {
      sendok = true;
      newobj.porvenceroklist = nextProps.porvenceroklist;
    }

    if (sendok === true) {
      this.loadinfo(nextProps, newobj);
    }
  }

  componentWillUnmount() { }

  loadAllData = () => {
    const { getLists, idlocal } = this.props;
    getLists(actionFetch.goGetCuentasParam(0));
    getLists(actionFetch.goGetFinanzasPorVencerParam(0, idlocal, 1));
    getLists(actionFetch.goGetFinanzasPorVencerParam(1, idlocal, 2));
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

    _objestate.list = this.getListFinanzas(props.porvenceroklist, props.porvencerlist);
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

  getListFinanzas = (ganancias, gastos) => {
    if (ganancias && gastos) {
      ganancias.sort(utilDynamicSort('-date'));
      const n = ganancias.length;
      const arrTodo = [];
      let i;
      for (i = 0; i < n; i += 1) {
        const tempdate = new Date(ganancias[i].date);
        const _keydate = String(tempdate.getDate() + '' + tempdate.getMonth() + '' + tempdate.getFullYear()); // eslint-disable-line prefer-template

        let algon = this.checkAddNewObjectList(_keydate, arrTodo);
        if (algon === true) {
          arrTodo.push({ keydate: _keydate, date: ganancias[i].date, list: [] });
          algon = this.checkAddNewObjectList(_keydate, arrTodo);
        }

        const objtemp = { n: i, obj: ganancias[i], type: 1 };
        arrTodo[algon].list.push(objtemp);
      }

      gastos.sort(utilDynamicSort('-date'));
      const m = gastos.length;
      let j;
      for (j = 0; j < m; j += 1) {
        const tempdate = new Date(gastos[j].date);
        const _keydate = String(tempdate.getDate() + '' + tempdate.getMonth() + '' + tempdate.getFullYear()); // eslint-disable-line prefer-template

        let algon = this.checkAddNewObjectList(_keydate, arrTodo);
        if (algon === true) {
          arrTodo.push({ keydate: _keydate, date: gastos[j].date, list: [] });
          algon = this.checkAddNewObjectList(_keydate, arrTodo);
        }

        const objtemp = { n: j, obj: gastos[j], type: 0 };
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
      };
      if (forceclose) {
        objset.sendingload = false;
      }
      this.setState(objset);
    }
  };

  handleClickPagar = (_item) => {
    this.setState({
      modaldelete: !this.state.modaldelete,
      modaldeleteItem: _item,
      modaldeleteispay: true,
    });
  };

  handleClickDelete = (_item) => {
    this.setState({
      modaldelete: !this.state.modaldelete,
      modaldeleteItem: _item,
      modaldeleteispay: false,
    });
  };

  getDate = (newdate) => {
    const newda = new Date(newdate);
    return String(moment(newda).format('dddd') + ' ' + moment(newda).format('LL')).toLocaleUpperCase(); // eslint-disable-line prefer-template
  };

  getTableList = (item) => {
    const { cuentalist } = this.props;
    return (
      <div key={item.date} >
        <small className="row pl-3 mt-3 pb-2 mb-0 text-muted text-uppercase font-weight-bold">{this.getDate(item.date)}</small>
        {item.list.map((itemii, i) => {
          let classbg = 'grid-bg-itemone pl-3 pt-2 pb-1';
          if (i % 2 === 1) {
            classbg = 'grid-bg-itemtwo pl-3 pt-2 pb-1';
          }
          return (
            <Row key={itemii.obj.idpv} className={classbg}>
              <Col xs="6" sm="6" lg="6" className="p-1">
                <div>{utilGetObjetForId(cuentalist, itemii.obj.idtarget, 'idtarget', 'nametarget').toLocaleUpperCase()}</div>
              </Col>
              <Col xs="4" sm="4" lg="4" className="p-1">
                <div className={(itemii.type === 0) ? 'text-danger' : 'text-success'}>{utilToMoney(itemii.obj.valor)}</div>
              </Col>
              <Col xs="1" sm="1" lg="1" className="p-1">
                {(itemii.type === 1) ? '' : <a className="nav-link d-inline-block pt-0 pb-0 float-right" onClick={() => this.handleClickPagar(itemii)} role="button" tabIndex="0">
                  <i className="fa fa-money icons font-2xl d-block" />
                </a>
                }
              </Col>
              <Col xs="1" sm="1" lg="1" className="p-1">
                <a className="nav-link d-inline-block pt-0 pb-0 float-right" onClick={() => this.handleClickDelete(itemii)} role="button" tabIndex="0">
                  <i className="fa fa-trash-o icons font-2xl d-block" />
                </a>
              </Col>
            </Row>
          );
        })}
      </div>
    );
  };

  renderUserList = (): Element<any> => {
    const { infoload, extra, history, goSendData, goSendNotification, goDeleteData, getLists, idlocal } = this.props; // eslint-disable-line max-len
    const { getTableList, toggleDeleteAlerta } = this;
    const { list, modaldelete, modaldeleteItem, sendingload, modaldeleteispay } = this.state;
    if (infoload !== true || !list) {
      return (
        <ReactLoading type="spin" delay={0} color="#97b0c1" height={30} width={30} />
      );
    }

    const togglePagarOK = () => {
      if (modaldeleteItem) {
        this.setState({ sendingload: true });
        goSendData({
          service: 'aws',
          method: 'pvpay',
          query: {
            cuotaid: modaldeleteItem.obj.extra[0].c_cuotaid,
            idpv: modaldeleteItem.obj.idpv,
          },
        })
          .then((res) => {
            toggleDeleteAlerta(true);
            console.log(res);
            goDeleteData(actionFetch.goGetFinanzasGastosDelete());
            goDeleteData(actionFetch.goGetFinanzasCuotasDelete());
            goDeleteData(actionFetch.goGetFinanzasPorVencerDelete(0));
            goDeleteData(actionFetch.goGetFinanzasPorVencerDelete(1));
            goSendNotification({ msj: 'Gasto Por Vencer Pagado!' });
            getLists(actionFetch.goGetFinanzasPorVencerParam(0, idlocal, 1));
            getLists(actionFetch.goGetFinanzasPorVencerParam(1, idlocal, 2));
            const asas = true;
            if (!asas) {
              history.push('/finanzas/historial/ganancias-y-gastos');
            }
          })
          .catch((error) => {
            console.log(error);
            console.log('error de login');
            toggleDeleteAlerta(true);
          });
      }
    };

    const toggleDeleteAlertaOK = () => {
      if (modaldeleteItem) {
        this.setState({ sendingload: true });
        goSendData({
          service: 'aws',
          method: 'pvdelete',
          query: {
            idpv: modaldeleteItem.obj.idpv,
          },
        })
          .then((res) => {
            toggleDeleteAlerta(true);
            console.log(res);
            goDeleteData(actionFetch.goGetFinanzasCuotasDelete());
            goDeleteData(actionFetch.goGetFinanzasPorVencerDelete(0));
            goDeleteData(actionFetch.goGetFinanzasPorVencerDelete(1));
            goSendNotification({ msj: 'Gasto Por Vencer Eliminado!' });
            getLists(actionFetch.goGetFinanzasPorVencerParam(0, idlocal, 1));
            getLists(actionFetch.goGetFinanzasPorVencerParam(1, idlocal, 2));
          })
          .catch((error) => {
            console.log(error);
            console.log('error de login');
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
                <CardBlock className="card-body pt-1">
                  {(list.length === 0) ? 'No hay datos...' : list.map(item => getTableList(item))}
                </CardBlock>
              </Card>
            </Col>
          </Row>
        </div>
        <Modal isOpen={modaldelete} toggle={toggleDeleteAlerta} className={'modal-sm'}>
          {(modaldeleteispay) ? <div>
            <ModalHeader toggle={toggleDeleteAlerta}>{(sendingload) ? 'Pagando' : 'Pagar'}</ModalHeader>
            <ModalBody>
              {(sendingload) ? 'Espere un momento...' : '¿Esta seguro de pagar?'}
            </ModalBody>
            {(sendingload) ? '' : <ModalFooter>
              <Button color="success" onClick={togglePagarOK}>Pagar!</Button>{' '}
              <Button color="secondary" onClick={toggleDeleteAlerta}>Cancelar</Button>
            </ModalFooter>}
          </div> : <div>
            <ModalHeader toggle={toggleDeleteAlerta}>{(sendingload) ? 'Eliminando' : 'Eliminar'}</ModalHeader>
            <ModalBody>
              {(sendingload) ? 'Espere un momento...' : '¿Esta seguro de eliminar?'}
            </ModalBody>
            {(sendingload) ? '' : <ModalFooter>
              <Button color="danger" onClick={toggleDeleteAlertaOK}>Eliminar!</Button>{' '}
              <Button color="secondary" onClick={toggleDeleteAlerta}>Cancelar</Button>
            </ModalFooter>}
          </div>}
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

const mapStateToProps = ({ utilfetch, local }: Reducer) => {
  let _infoload = false;
  if (utilfetch.cuentas.data !== undefined && utilfetch.finanzas_porvencer.data !== undefined && utilfetch.finanzas_porvencerok.data !== undefined) { // eslint-disable-line max-len
    _infoload = true;
  }
  const props = {
    idlocal: local.id,
    cuentalist: utilfetch.cuentas.data,
    porvencerlist: sortLocal(utilfetch.finanzas_porvencer.data, local.id),
    porvenceroklist: sortLocal(utilfetch.finanzas_porvencerok.data, local.id),
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

export default withRouter(connector(HistoriaFinanzasPorVencer));
