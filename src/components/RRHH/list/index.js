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
import { utilDynamicSort, sortLocal, utilToMoney } from '../../../utils/appUtils';

type Props = {
  idlocal: Number,
  personallist: Object,
  getLists: () => void,
  goSendData: () => void,
  goSendNotification: () => void,
  goDeleteData: () => void,
  infoload: Boolean,
  extra: Object,
  history: PropTypes.object.isRequired,
};

// Export this for unit testing more easily
export class RRHHPersonalList extends PureComponent {
  props: Props;

  static defaultProps: {
    idlocal: '',
    list: [],
    personallist: {},
    getLists: () => {},
    goSendData: () => {},
    goSendNotification: () => {},
    goDeleteData: () => {},
    infoload: false,
    extra: {},
  };

  state = {
    personallist: this.props.personallist,
    list: [],
    modaldelete: false,
    modaldeleteItem: {},
    sendingload: false,
    infoload: false,
  }

  componentDidMount() {
    this.loadAllData();
    this.loadinfo(this.props);
  }

  componentWillMount() { }

  componentWillReceiveProps(nextProps) {
    const { personallist } = this.state;
    const newobj = { };
    let sendok = false;

    if (personallist !== nextProps.personallist) {
      sendok = true;
      newobj.personallist = nextProps.personallist;
    }

    if (sendok === true) {
      this.loadinfo(nextProps, newobj);
    }
  }

  componentWillUnmount() { }

  loadAllData = () => {
    const { getLists } = this.props;
    getLists(actionFetch.goGetPersonalParam(0));
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
    _objestate.list = this.getListPersonal(props.personallist);
    this.setState(_objestate);
  }

  getListPersonal = (_list) => {
    const lista = _list;
    lista.sort(utilDynamicSort('nametarget'));
    return lista;
  };

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

  handleClickDelete = (_item) => {
    this.setState({
      modaldelete: !this.state.modaldelete,
      modaldeleteItem: _item,
    });
  };

  getDate = (newdate) => {
    const newda = new Date(newdate);
    return String(moment(newda).format('dddd') + ' ' + moment(newda).format('LL')).toLocaleUpperCase(); // eslint-disable-line prefer-template
  };

  handleClickUpdate = (_item) => {
    console.log(_item);
    const { history } = this.props;
    const urlbase = '/rrhh/personal/editar-personal/';
    history.push(urlbase + _item.idpersonal);
  }

  getDateUpdate = (newdate) => {
    const newda = new Date();
    newda.setTime(newdate);
    return String(moment(newda).fromNow() + ' (' + moment(newda).format('L') + ')'); // eslint-disable-line prefer-template
  }

  getAdelanto = (_item) => {
    if (_item.adelantos.length > 0) {
      const newda = new Date();
      let _suma = 0;
      const n = _item.adelantos.length;
      let i;
      for (i = 0; i < n; i += 1) {
        const temda = new Date();
        temda.setTime(_item.adelantos[i].date);
        if (temda.getFullYear === newda.getFullYear && temda.getMonth === newda.getMonth) {
          _suma += Number(_item.adelantos[i].valor);
        }
      }

      return utilToMoney(_suma);
    }
    return 0;
  }

  getTurno = (_item) => {
    if (_item.turno.length > 0) {
      const newda = new Date();
      let _suma = 0;
      const n = _item.turno.length;
      let i;
      for (i = 0; i < n; i += 1) {
        const temda = new Date();
        temda.setTime(_item.turno[i].date);
        if (temda.getFullYear === newda.getFullYear && temda.getMonth === newda.getMonth) {
          _suma += Number(_item.turno[i].valor);
        }
      }

      return utilToMoney(_suma);
    }
    return 0;
  }

  getTableList = (item, i) => {
    let classbg = 'grid-bg-itemone pl-3 pt-2 pb-1';
    if (i % 2 === 1) {
      classbg = 'grid-bg-itemtwo pl-3 pt-2 pb-1';
    }
    const _nameandlast = item.nombre + ' ' + item.lastname; // eslint-disable-line prefer-template
    return (
      <Row key={i} className={classbg}>
        <Col xs="5" sm="6" lg="6" className="p-1">
          <div>{_nameandlast}</div>
        </Col>
        <Col xs="5" sm="4" lg="4" className="p-1">
          <div>{utilToMoney(item.sueldo)}</div>
          <div className="text-danger">{this.getAdelanto(item)}</div>
          <div className="text-success">{this.getTurno(item)}</div>
        </Col>
        <Col xs="1" sm="1" lg="1" className="p-1">
          <a className="nav-link d-inline-block pt-0 pb-0 float-right" onClick={() => this.handleClickUpdate(item)} role="button" tabIndex={i}>
            <i className="fa fa-edit icons font-2xl d-block" />
          </a>
        </Col>
        <Col xs="1" sm="1" lg="1" className="p-1">
          <a className="nav-link d-inline-block pt-0 pb-0 float-right" onClick={() => this.handleClickDelete(item)} role="button" tabIndex="0">
            <i className="fa fa-trash-o icons font-2xl d-block text-danger" />
          </a>
        </Col>
      </Row>
    );
  };

  renderUserList = (): Element<any> => {
    const { infoload, extra, goSendData, goSendNotification, goDeleteData, getLists, idlocal, history } = this.props; // eslint-disable-line max-len
    const { getTableList, toggleDeleteAlerta } = this;
    const { list, modaldelete, modaldeleteItem, sendingload } = this.state;
    if (infoload !== true || !list) {
      return (
        <ReactLoading type="spin" delay={0} color="#97b0c1" height={30} width={30} />
      );
    }

    const asdasd = true;
    if (!asdasd) {
      console.log(idlocal);
    }

    const clickNuevaCuenta = () => {
      history.push('/rrhh/personal/agregar-personal');
    };

    const toggleDeleteAlertaOK = () => {
      if (modaldeleteItem) {
        console.log(modaldeleteItem);
        this.setState({ sendingload: true });

        goSendData({
          service: 'aws',
          method: 'rrhhpersonaldelete',
          query: {
            idpersonal: modaldeleteItem.idpersonal,
          },
        })
          .then((res) => {
            toggleDeleteAlerta(true);
            console.log(res);

            goDeleteData(actionFetch.goGetPersonalDelete());
            goSendNotification({ msj: 'Personal Eliminado!' });
            getLists(actionFetch.goGetPersonalParam(1));
          })
          .catch((error) => {
            console.log(error);
            console.log('error delete Personal');
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
            <Col xs="12" sm="12" lg="10" className="pl-0 mb-1">
              <Button type="submit" size="sm" color="primary" onClick={clickNuevaCuenta} className="float-right"><i className="fa fa-dot-circle-o mr-2" />Agregar Personal</Button>
            </Col>
            <Col xs="12" sm="12" lg="10">
              <Card>
                <CardBlock className="card-body">
                  {(list.length === 0) ? <Row className="grid-bg-itemone pl-3 pt-2 pb-2"><Col xs="12">{'No hay datos...'}</Col></Row> : list.map((item, i) => getTableList(item, i))}
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

const mapStateToProps = ({ utilfetch, local }: Reducer) => {
  let _infoload = false;
  if (utilfetch.personal.data !== undefined) { // eslint-disable-line max-len
    _infoload = true;
  }
  const props = {
    idlocal: local.id,
    personallist: sortLocal(utilfetch.personal.data, local.id),
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

export default withRouter(connector(RRHHPersonalList));
