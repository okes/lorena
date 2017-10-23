/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import type { Connector } from 'react-redux';
import { Row, Col, Card, FormGroup, Label, Input, CardBlock, CardFooter, Button } from 'reactstrap';
import ReactLoading from 'react-loading';
import { withRouter } from 'react-router-dom';

import type { Reducer, Dispatch } from '../../../../types';
import { sortLocal } from '../../../../utils/appUtils';
import * as actionFetch from '../../../../utils/fetch/action';
import * as actionNotification from '../../../../utils/notification/action';

type Props = {
  mercaderialist: Object,
  idlocal: Number,
  goDeleteData: () => void,
  getLists: () => void,
  goSendData: () => void,
  goSendNotification: () => void,
  infoload: Boolean,
  extra: Object,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

// Export this for unit testing more easily
export class FormAdd extends PureComponent {
  props: Props;

  static defaultProps: {
    idlocal: '',
    mercaderialist: {},
    goDeleteData: () => {},
    getLists: () => {},
    goSendData: () => {},
    goSendNotification: () => {},
    infoload: false,
    extra: {},
  };

  state = {
    mercaderialist: this.props.mercaderialist,
    idmerca: '',
    nameMerca: '',
    unidadMerca: '',
    sending: false,
    formerror: false,
    infoload: false,
  }

  componentDidMount() {
    this.loadAllData();
    this.checkId(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { mercaderialist, idmerca } = this.state;
    const newobj = { };
    let sendok = false;

    if (mercaderialist !== nextProps.mercaderialist) {
      sendok = true;
      newobj.mercaderialist = nextProps.mercaderialist;
    }

    if (idmerca !== nextProps.match.params.id) {
      sendok = true;
      newobj.idmerca = nextProps.match.params.id;
    }

    if (sendok === true) {
      this.checkId(nextProps, newobj);
    }
  }

  componentWillUnmount() { }

  loadAllData = () => {
    const { getLists, idlocal } = this.props;
    getLists(actionFetch.goGetMercaderiaParam(idlocal, 1));
  }

  checkId = (_props, newobj) => {
    let _objestate = {};
    if (newobj) {
      _objestate = newobj;
    }

    let infi = false;
    const { infoload } = this.state;
    if (infoload !== _props.infoload) {
      _objestate.infoload = _props.infoload;
      infi = true;

      if (infoload === true && _props.infoload === false) {
        _objestate.nameMerca = '';
        _objestate.unidadMerca = '';
        _objestate.idmerca = undefined;
        this.loadAllData();
      }
    }

    const { match, mercaderialist } = _props;
    const { idmerca } = this.state;
    const changename = true;
    if (mercaderialist.length > 0 && match.params.id !== idmerca && !_objestate.idmerca) {
      _objestate.idmerca = match.params.id;
    }

    if (changename) {
      let i;
      const n = mercaderialist.length;
      let cuentaoka = false;
      for (i = 0; i < n; i += 1) {
        if (mercaderialist[i].idmerca === match.params.id) {
          cuentaoka = true;
          _objestate.nameMerca = mercaderialist[i].nametarget;
          _objestate.unidadMerca = mercaderialist[i].unidad;
        }
      }
      if (!cuentaoka) {
        console.log('error no hay mercaderia');
      }
    }

    if (changename || infi) {
      this.setState(_objestate);
    }
  };

  renderUserList = (): Element<any> => {
    const { infoload, extra, goSendData, goSendNotification, history, match, goDeleteData, getLists, idlocal } = this.props; // eslint-disable-line max-len
    const { sending, formerror, nameMerca, unidadMerca } = this.state; // eslint-disable-line max-len
    if (infoload !== true) {
      return (
        <ReactLoading type="spin" delay={0} color="#97b0c1" height={30} width={30} />
      );
    }

    const handleChangenameMerca = (e) => {
      this.setState({ nameMerca: e.target.value });
    };

    const handleChangeunidadMerca = (e) => {
      this.setState({ unidadMerca: e.target.value });
    };

    const nameMercaIsError = (_val) => {
      if (_val === '' || _val.length <= 1) {
        return true;
      }
      return false;
    };

    const unidadMercaIsError = (_val) => {
      if (_val === '' || _val.length <= 1) {
        return true;
      }
      return false;
    };

    const submitResponse = (res) => {
      console.log('res add / update cuenta');
      console.log(res);
      goDeleteData(actionFetch.goGetCuentasDelete());
      if (match.params.id) {
        goSendNotification({ msj: 'Mercaderia Actualizada!' });
      } else {
        goSendNotification({ msj: 'Mercaderia Agregada!' });
      }
      getLists(actionFetch.goGetCuentasParam(0));

      history.push('/mercaderia/lista');
    };

    const clickBackCuenta = () => {
      history.push('/mercaderia/lista');
    };

    const clickSubmit = () => {
      let errorok = false;
      if (!sending) {
        this.setState({ sending: true, formerror: true });

        if (nameMercaIsError(nameMerca)) {
          errorok = true;
        }
        if (!errorok) {
          const querystring = {
            type: 1,
            name: nameMerca,
            unidad: unidadMerca,
          };

          if (match.params.id) {
            querystring.idmerca = match.params.id;
          }

          querystring.idlocal = idlocal;

          goSendData({
            service: 'aws',
            method: 'mercaderiaadd',
            query: querystring,
          })
            .then((res) => {
              submitResponse(res.data.response);
            })
            .catch((error) => {
              console.log(error);
              console.log('error add mercaderia');
            });
        } else {
          this.setState({ sending: false });
        }
      }
    };

    return (
      <div className="animated fadeIn">
        <Helmet title={extra.name} />
        <Row>
          <Col xs="12" sm="8" lg="6">
            <Card>
              <CardBlock className="card-body">
                <Row>
                  <Col xs="12">
                    <FormGroup color={(formerror && nameMercaIsError(nameMerca) ? 'danger' : null)}>
                      <Label htmlFor="ccnameMerca">Nombre</Label>
                      <Input type="text" id="ccnameMerca" className="form-control-danger" placeholder="Nombre de la mercaderia" required value={nameMerca} onChange={handleChangenameMerca} />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup color={(formerror && unidadMercaIsError(unidadMerca) ? 'danger' : null)}>
                      <Label htmlFor="ccunidadMerca">Unidad</Label>
                      <Input type="text" id="ccunidadMerca" className="form-control-danger" placeholder="unidad de la mercaderia" required value={unidadMerca} onChange={handleChangeunidadMerca} />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBlock>
              <CardFooter>
                <Button type="submit" size="sm" color="primary" onClick={clickSubmit}><i className="fa fa-dot-circle-o mr-2" />{(match.params.id) ? 'Actualizar' : 'Agregar'}</Button>
                <Button type="submit" size="sm" color="primary" onClick={clickBackCuenta} className="float-right"><i className="fa fa-dot-circle-o mr-2" />Cancelar</Button>
              </CardFooter>
            </Card>
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
    goDeleteData: (_name: String) => dispatch(actionFetch.deleteData(_name)),
    getLists: (_param:Object) => dispatch(actionFetch.addData(_param)),
    goSendData: (_objsend: Object, _mas:any) => dispatch(actionFetch.goSendData(_objsend, _mas)),
    goSendNotification: (_param:any) => dispatch(actionNotification.sendNotification(_param)),
  }),
);

export default withRouter(connector(FormAdd));
