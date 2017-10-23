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
import { getCuentas } from '../../../../utils/appUtils';
import * as actionFetch from '../../../../utils/fetch/action';
import * as actionNotification from '../../../../utils/notification/action';

type Props = {
  cuentalist: Object,
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
    cuentalist: {},
    goDeleteData: () => {},
    getLists: () => {},
    goSendData: () => {},
    goSendNotification: () => {},
    infoload: false,
    extra: {},
  };

  state = {
    cuentalist: this.props.cuentalist,
    cuentaid: '',
    nameCuenta: '',
    sending: false,
    formerror: false,
    infoload: false,
  }

  componentDidMount() {
    this.loadAllData();
    this.checkId(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { cuentalist, cuentaid } = this.state;
    const newobj = { };
    let sendok = false;

    if (cuentalist !== nextProps.cuentalist) {
      sendok = true;
      newobj.cuentalist = nextProps.cuentalist;
    }

    if (cuentaid !== nextProps.match.params.id) {
      sendok = true;
      newobj.cuentaid = nextProps.match.params.id;
    }

    if (sendok === true) {
      this.checkId(nextProps, newobj);
    }
  }

  componentWillUnmount() { }

  loadAllData = () => {
    const { getLists } = this.props;
    getLists(actionFetch.goGetCuentasParam(0));
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
        this.loadAllData();
      }
    }

    const { match, cuentalist } = _props;
    const { cuentaid } = this.state;
    let changename = false;
    if (cuentalist.length > 0 && match.params.id !== cuentaid && !_objestate.cuentaid) {
      changename = true;
      _objestate.cuentaid = match.params.id;
    }

    if (changename) {
      let i;
      const n = cuentalist.length;
      let cuentaoka = false;
      for (i = 0; i < n; i += 1) {
        if (cuentalist[i].idtarget === match.params.id) {
          cuentaoka = true;
          _objestate.nameCuenta = cuentalist[i].nametarget;
        }
      }
      if (!cuentaoka) {
        console.log('error no hay cuenta');
      }
    }
    if (changename || infi) {
      this.setState(_objestate);
    }
  };

  renderUserList = (): Element<any> => {
    const { infoload, extra, goSendData, goSendNotification, history, match, goDeleteData, getLists } = this.props; // eslint-disable-line max-len
    const { sending, formerror, nameCuenta } = this.state; // eslint-disable-line max-len
    if (infoload !== true) {
      return (
        <ReactLoading type="spin" delay={0} color="#97b0c1" height={30} width={30} />
      );
    }

    const handleChangenameCuenta = (e) => {
      this.setState({ nameCuenta: e.target.value });
    };

    const nameCuentaIsError = (_val) => {
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
        goSendNotification({ msj: 'Cuenta Actualizada!' });
      } else {
        goSendNotification({ msj: 'Cuenta Agregada!' });
      }
      getLists(actionFetch.goGetCuentasParam(0));

      history.push('/finanzas/cuentas');
    };

    const clickBackCuenta = () => {
      history.push('/finanzas/cuentas');
    };

    const clickSubmit = () => {
      let errorok = false;
      if (!sending) {
        this.setState({ sending: true, formerror: true });

        if (nameCuentaIsError(nameCuenta)) {
          errorok = true;
        }
        if (!errorok) {
          const querystring = {
            type: 1,
            name: nameCuenta,
          };
          if (match.params.id) {
            querystring.idtarget = match.params.id;
          }
          goSendData({
            service: 'aws',
            method: 'cuentasadd',
            query: querystring,
          })
            .then((res) => {
              submitResponse(res.data.response);
            })
            .catch((error) => {
              console.log(error);
              console.log('error add cuenta');
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
                    <FormGroup color={(formerror && nameCuentaIsError(nameCuenta) ? 'danger' : null)}>
                      <Label htmlFor="ccnameCuenta">Nombre</Label>
                      <Input type="text" id="ccnameCuenta" className="form-control-danger" placeholder="Nombre de la cuenta" required value={nameCuenta} onChange={handleChangenameCuenta} />
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

const mapStateToProps = ({ utilfetch }: Reducer) => {
  let _infoload = false;
  if (utilfetch.cuentas.data !== undefined) { // eslint-disable-line max-len
    _infoload = true;
  }

  const props = {
    cuentalist: getCuentas(utilfetch.cuentas.data),
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
