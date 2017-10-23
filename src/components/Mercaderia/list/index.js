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
import { utilDynamicSort, sortLocal } from '../../../utils/appUtils';

type Props = {
  idlocal: Number,
  mercaderialist: Object,
  getLists: () => void,
  goSendData: () => void,
  goSendNotification: () => void,
  goDeleteData: () => void,
  infoload: Boolean,
  extra: Object,
  history: PropTypes.object.isRequired,
};

// Export this for unit testing more easily
export class HistoriaFinanzas extends PureComponent {
  props: Props;

  static defaultProps: {
    idlocal: '',
    list: [],
    mercaderialist: {},
    getLists: () => {},
    goSendData: () => {},
    goSendNotification: () => {},
    goDeleteData: () => {},
    infoload: false,
    extra: {},
  };

  state = {
    mercaderialist: this.props.mercaderialist,
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
    const { mercaderialist } = this.state;
    const newobj = { };
    let sendok = false;

    if (mercaderialist !== nextProps.mercaderialist) {
      sendok = true;
      newobj.mercaderialist = nextProps.mercaderialist;
    }

    if (sendok === true) {
      this.loadinfo(nextProps, newobj);
    }
  }

  componentWillUnmount() { }

  loadAllData = () => {
    const { getLists, idlocal } = this.props;
    getLists(actionFetch.goGetMercaderiaParam(idlocal, 1));
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
    _objestate.list = this.getListMercaderia(props.mercaderialist);
    this.setState(_objestate);
  }

  getListMercaderia = (_list) => {
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
    const { history } = this.props;
    const urlbase = '/mercaderia/editar-mercaderia/';
    history.push(urlbase + _item.idmerca);
  }

  getDateUpdate = (newdate) => {
    const newda = new Date();
    newda.setTime(newdate);
    return String(moment(newda).fromNow() + ' (' + moment(newda).format('L') + ')'); // eslint-disable-line prefer-template
  }

  getTableList = (item, i) => {
    let classbg = 'grid-bg-itemone pl-3 pt-2 pb-1';
    if (i % 2 === 1) {
      classbg = 'grid-bg-itemtwo pl-3 pt-2 pb-1';
    }
    return (
      <Row key={item.idmerca} className={classbg}>
        <Col xs="10" sm="10" lg="10" className="p-1">
          <div>{item.nametarget}</div>
          <div>{(item.lastupdate) ? this.getDateUpdate(item.lastupdate) : 'nuevo'}</div>
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
      history.push('/mercaderia/nueva-mercaderia');
    };

    const toggleDeleteAlertaOK = () => {
      if (modaldeleteItem) {
        console.log(modaldeleteItem);
        this.setState({ sendingload: true });

        goSendData({
          service: 'aws',
          method: 'mercaderiadelete',
          query: {
            idmerca: modaldeleteItem.idmerca,
            type: modaldeleteItem.type,
          },
        })
          .then((res) => {
            toggleDeleteAlerta(true);
            console.log(res);

            goDeleteData(actionFetch.goGetMercaderiaDelete());
            goSendNotification({ msj: 'Mercaderia Eliminada!' });
            getLists(actionFetch.goGetMercaderiaParam(idlocal, 1));
          })
          .catch((error) => {
            console.log(error);
            console.log('error delete mercaderia');
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
              <Button type="submit" size="sm" color="primary" onClick={clickNuevaCuenta} className="float-right"><i className="fa fa-dot-circle-o mr-2" />Nueva Mercaderia</Button>
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
  if (utilfetch.mercaderia.data !== undefined) { // eslint-disable-line max-len
    _infoload = true;
  }
  const props = {
    idlocal: local.id,
    mercaderialist: sortLocal(utilfetch.mercaderia.data, local.id),
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

export default withRouter(connector(HistoriaFinanzas));
