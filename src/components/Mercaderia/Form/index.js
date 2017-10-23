/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import type { Connector } from 'react-redux';
import { Row, Col, Card, FormGroup, Label, Input, CardBlock, CardFooter, Button, Modal } from 'reactstrap';
import ReactLoading from 'react-loading';
import { withRouter } from 'react-router-dom';

import FormDateSel from '../../Utils/FormDateSelector';
import type { Reducer, Dispatch } from '../../../types';
import * as actionFetch from '../../../utils/fetch/action';
import * as actionNotification from '../../../utils/notification/action';
import FormAddModal from './add';
import { utilGetObjetForId, sortLocal, getCuentas, utilToMoney } from '../../../utils/appUtils';

type Props = {
  idlocal: Number,
  getLists: () => void,
  goDeleteData: () => void,
  goSendData: () => void,
  goSendNotification: () => void,
  mercalist: () => void,
  cuentalist: () => void,
  infoload: Boolean,
  extra: Object,
  history: PropTypes.object.isRequired,
};

// Export this for unit testing more easily
export class FormMercaderiaAdd extends PureComponent {
  props: Props;

  static defaultProps: {
    idlocal: '',
    cuentalist: {},
    getLists: () => {},
    mercalist: () => {},
    cuentalist: () => {},
    goDeleteData: () => {},
    goSendData: () => {},
    goSendNotification: () => {},
    infoload: false,
    extra: {},
  };

  state = {
    datecur: '',
    nota: '',
    listmerca: [],
    sending: false,
    formerror: false,
    modaladd: false,
    modaladditem: {},
    mercalist: [],
    cuentalist: [],
    infoload: false,
  }

  componentDidMount() {
    this.loadinfo(this.props);
  }

  componentWillUnmount() { }

  componentWillReceiveProps(nextProps) {
    const { cuentalist, mercalist } = this.state;
    const newobj = {};
    let sendok = false;

    if (cuentalist !== nextProps.cuentalist) {
      sendok = true;
      newobj.cuentalist = nextProps.cuentalist;
    }

    if (mercalist !== nextProps.mercalist) {
      sendok = true;
      newobj.mercalist = nextProps.mercalist;
    }

    if (sendok === true) {
      this.loadinfo(nextProps, newobj);
    }
  }

  loadAllData = () => {
    const { getLists, idlocal } = this.props;
    getLists(actionFetch.goGetCuentasParam(0));
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

    this.setState(_objestate);
  }

  handleClickUpdate = (item, i) => {
    this.setState({ modaladd: true, modaladditem: item, superi: i });
  }

  handleClickDelete = (item, _i) => {
    const { listmerca } = this.state;
    const _newarr = [];
    const n = listmerca.length;
    let i;
    for (i = 0; i < n; i += 1) {
      if (i !== _i) {
        _newarr.push(item);
      }
    }
    this.setState({ listmerca: _newarr });
  }

  getTableList = (item, i) => {
    const { extra, mercalist, cuentalist } = this.props;

    let classbg = 'grid-bg-itemone pl-3 pt-2 pb-1';
    if (i % 2 === 1) {
      classbg = 'grid-bg-itemtwo pl-3 pt-2 pb-1';
    }
    if (extra.typeform === 'quitar') {
      /*  eslint-disable prefer-template */
      return (
        <Row key={i} className={classbg}>
          <Col xs="5" sm="6" lg="6" className="p-1">
            <div>{utilGetObjetForId(mercalist, item.mercaid, 'idmerca', 'nametarget').toLocaleUpperCase()}</div>
          </Col>
          <Col xs="5" sm="4" lg="4" className="p-1">
            <small className="d-inline-block">{item.cantidad}</small>
            <small className="d-inline-block ml-1">{utilGetObjetForId(mercalist, item.mercaid, 'idmerca', 'unidad').toLocaleUpperCase()}</small>
          </Col>
          <Col xs="1" sm="1" lg="1" className="p-1">
            <a className="nav-link d-inline-block pt-0 pb-0 float-right" onClick={() => this.handleClickUpdate(item, i)} role="button" tabIndex={i}>
              <i className="fa fa-edit icons font-2xl d-block" />
            </a>
          </Col>
          <Col xs="1" sm="1" lg="1" className="p-1">
            <a className="nav-link d-inline-block pt-0 pb-0 float-right" onClick={() => this.handleClickDelete(item, i)} role="button" tabIndex="0">
              <i className="fa fa-trash-o icons font-2xl d-block text-danger" />
            </a>
          </Col>
        </Row>
      );
      /*  eslint-enable prefer-template */
    }

    return (
      <Row key={i} className={classbg}>
        <Col xs="5" sm="6" lg="6" className="p-1">
          <div>{utilGetObjetForId(mercalist, item.mercaid, 'idmerca', 'nametarget').toLocaleUpperCase()}</div>
          <div>{utilGetObjetForId(cuentalist, item.cuentaid, 'idtarget', 'nametarget').toLocaleLowerCase()}</div>
        </Col>
        <Col xs="5" sm="4" lg="4" className="p-1">
          <div>
            <small className="d-inline-block">{item.cantidad}</small>
            <small className="d-inline-block ml-1">{utilGetObjetForId(mercalist, item.mercaid, 'idmerca', 'unidad').toLocaleUpperCase()}</small>
          </div>
          <div className="text-danger">{utilToMoney(item.valor)}</div>
        </Col>
        <Col xs="1" sm="1" lg="1" className="p-1">
          <a className="nav-link d-inline-block pt-0 pb-0 float-right" onClick={() => this.handleClickUpdate(item, i)} role="button" tabIndex={i}>
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
    const { getTableList } = this;
    const { infoload, extra, idlocal, goSendData, goSendNotification, history, goDeleteData } = this.props; // eslint-disable-line max-len
    const { sending, datecur, nota, listmerca, modaladd, modaladditem, superi, formerror } = this.state; // eslint-disable-line max-len
    if (infoload !== true) {
      return (
        <ReactLoading type="spin" delay={0} color="#97b0c1" height={30} width={30} />
      );
    }

    const handleChangeDate = (edate) => {
      this.setState({ datecur: edate });
    };

    const handleChangeNota = (e) => {
      this.setState({ nota: e.target.value });
    };

    const submitResponse = (res) => {
      console.log(res);
      goDeleteData(actionFetch.goGetMercaderiaDelete());

      if (extra.typeform === 'quitar') {
        goDeleteData(actionFetch.goGetMercaderiaComboDelete(0));
        goSendNotification({ msj: 'Quitar Mercaderia OK!' });
      } else {
        goDeleteData(actionFetch.goGetMercaderiaComboDelete(1));
        goDeleteData(actionFetch.goGetFinanzasGastosDelete());
        goSendNotification({ msj: 'Mercaderia Agregada!' });
      }

      history.push('/');
    };

    const listmercaIsError = (_val) => {
      if (_val.length === 0) {
        return true;
      }
      return false;
    };

    const getComboStr = (_comboarr) => {
      const n = _comboarr.length;
      let srtcom = '';
      let i;
      for (i = 0; i < n; i += 1) {
        const objte = _comboarr[i];

        if (i > 0) {
          srtcom += '__';
        }

        if (extra.typeform === 'quitar') {
          srtcom += objte.mercaid + '_' + objte.cantidad; // eslint-disable-line prefer-template
        } else {
          srtcom += objte.cuentaid + '_' + objte.mercaid + '_' + objte.cantidad + '_' + objte.valor; // eslint-disable-line prefer-template
        }

        if (objte.switchporvencer === true) {
          srtcom += '_' + objte.datevencer.getTime(); // eslint-disable-line prefer-template
        }
      }
      return srtcom;
    };

    const clickSubmit = () => {
      let errorok = true;
      if (!sending) {
        errorok = false;
        this.setState({ sending: true, formerror: true });

        if (listmercaIsError(listmerca)) {
          errorok = true;
        }

        if (!errorok) {
          const _idlocal = idlocal;
          const querystring = {
            uid: 'usuarioid',
            date: datecur.getTime(),
            combo: getComboStr(listmerca),
            idlocal: _idlocal,
          };

          if (nota !== '') {
            querystring.note = nota;
          }

          let _method = 'mercaderiacomboadd';

          if (extra.typeform === 'quitar') {
            _method = 'mercaderiacomboquitar';
          }

          goSendData({
            service: 'aws',
            method: _method,
            query: querystring,
          })
            .then((res) => {
              console.log(res);
              submitResponse(res.data);
            })
            .catch((error) => {
              console.log(error);
              console.log('ganancia add !!error!!');
            });
        } else {
          this.setState({ sending: false });
        }
      }
    };

    const toggleADDMODAL = (forceclose) => {
      const { sendingload } = this.state;
      if (!sendingload || forceclose) {
        const objset = {
          modaladd: !this.state.modaladd,
          modaladditem: {},
          superi: null,
        };
        if (forceclose) {
          objset.sendingload = false;
        }
        this.setState(objset);
      }
    };

    const toggleADDMODALOK = (_newarr) => {
      toggleADDMODAL(true);
      this.setState({ listmerca: _newarr });
    };

    let classcsserror = 'grid-bg-itemone pl-3 pt-2 pb-2';
    if (formerror && listmercaIsError(listmerca)) {
      classcsserror += ' text-danger';
    }
    /* eslint-disable max-len */
    return (
      <div className="animated fadeIn">
        <Helmet title={extra.name} />
        <Row>
          <Col xs="12" sm="8" lg="6">
            <Card>
              <CardBlock className="card-body">
                <FormDateSel value={datecur} onChange={handleChangeDate} />
                <Row>
                  <Col xs="12">
                    <FormGroup>
                      <Label htmlFor="ccnota">Nota</Label>
                      <Input type="text" id="ccnota" placeholder="Nota" required value={nota} onChange={handleChangeNota} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12">
                    <FormGroup>
                      <Button type="submit" size="sm" color="secondary" onClick={toggleADDMODAL} className="float-right"><i className="fa fa-dot-circle-o mr-2" />Agregar Mercaderia</Button>
                    </FormGroup>
                  </Col>
                </Row>
                <div className="pt-2">
                  {(listmerca.length === 0) ? <Row className={classcsserror}><Col xs="12">{'No hay datos...'}</Col></Row> : listmerca.map((item, i) => getTableList(item, i))}
                </div>
              </CardBlock>
              <CardFooter>
                <Button type="submit" size="sm" color="primary" onClick={clickSubmit}><i className="fa fa-dot-circle-o mr-2" />Enviar</Button>
              </CardFooter>
            </Card>
          </Col>
          <Modal isOpen={modaladd} className={'modal-lg'}>
            <FormAddModal extra={extra} clickClose={toggleADDMODAL} modaladditem={modaladditem} objcompra={listmerca} handlerAddMerca={toggleADDMODALOK} superi={superi} />
          </Modal>
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

const mapStateToProps = ({ local, utilfetch }: Reducer) => {
  const _infoload = true;

  const props = {
    idlocal: local.id,
    infoload: _infoload,
    mercalist: sortLocal(utilfetch.mercaderia.data, local.id),
    cuentalist: getCuentas(utilfetch.cuentas.data),
  };

  return props;
};

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  (dispatch: Dispatch) => ({
    goDeleteData: (_name: String) => dispatch(actionFetch.deleteData(_name)),
    getLists: (_param:Object) => dispatch(actionFetch.addData(_param)),
    goSendData: (_objsend: Object, _mas:any) => dispatch(actionFetch.goSendData(_objsend, _mas)),
    goSendNotification: (_param:any) => dispatch(actionNotification.sendNotification(_param)),
  }),
);

export default withRouter(connector(FormMercaderiaAdd));
