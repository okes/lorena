/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import type { Connector } from 'react-redux';
import { Row, Col, Card, FormGroup, Label, Input, CardBlock, CardFooter, Button } from 'reactstrap';
import ReactLoading from 'react-loading';

import FormDateSel from '../../../Utils/FormDateSelector';
import type { Reducer, Dispatch } from '../../../../types';
import { getCuentas, sortLocal } from '../../../../utils/appUtils';
import * as actionFetch from '../../../../utils/fetch/action';

type Props = {
  idlocal: Number,
  cuentalist: Object,
  mercalist: Object,
  modaladditem: Object,
  getLists: () => void,
  infoload: Boolean,
  extra: Object,
  superi: any,
  objcompra: Array,
  clickClose: () => void,
  handlerAddMerca: () => void,
};

// Export this for unit testing more easily
export class FormAdd extends PureComponent {
  props: Props;

  static defaultProps: {
    idlocal: '',
    cuentalist: {},
    mercalist: [],
    modaladditem: {},
    objcompra: [],
    handlerAddMerca: () => {},
    getLists: () => {},
    infoload: false,
    extra: {},
    superi: '',
  };

  state = {
    mercalist: this.props.mercalist,
    mercaid: '',
    cuentalist: this.props.cuentalist,
    cuentaid: '',
    valor: '',
    datevencer: '',
    cantidad: '',
    switchporvencer: false,
    sending: false,
    formerror: false,
  }

  componentDidMount() {
    const { getLists, idlocal, modaladditem } = this.props;
    this.checkItemNew(modaladditem);
    getLists(actionFetch.goGetCuentasParam(0));
    getLists(actionFetch.goGetMercaderiaParam(idlocal, 1));
  }

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
      this.setState(newobj);
    }
  }

  componentWillUnmount() { }

  checkItemNew = (modaladditem, newobj) => {
    let objsend = {};
    if (newobj) {
      objsend = newobj;
    }
    const { mercaid, cuentaid, valor, cantidad, datevencer } = this.state;
    if (modaladditem && modaladditem.mercaid && modaladditem.cantidad) {
      if (modaladditem.mercaid !== mercaid) {
        objsend.mercaid = modaladditem.mercaid;
      }
      if (modaladditem.cuentaid !== cuentaid) {
        objsend.cuentaid = modaladditem.cuentaid;
      }
      if (modaladditem.valor !== valor) {
        objsend.valor = modaladditem.valor;
      }
      if (modaladditem.cantidad !== cantidad) {
        objsend.cantidad = modaladditem.cantidad;
      }
      if (modaladditem.switchporvencer === true && modaladditem.datevencer !== datevencer) {
        objsend.datevencer = modaladditem.datevencer;
      }
      if (modaladditem.switchporvencer !== undefined) {
        objsend.switchporvencer = modaladditem.switchporvencer;
      }
    } else {
      objsend.mercaid = '';
      objsend.cuentaid = '';
      objsend.valor = '';
      objsend.cantidad = '';
      objsend.datevencer = '';
      objsend.switchporvencer = false;
    }
    this.setState(objsend);
  }

  renderUserList = (): Element<any> => {
    const { infoload, extra, clickClose } = this.props; // eslint-disable-line max-len
    const { sending, formerror, mercalist, mercaid, cuentalist, cuentaid, valor, datevencer, cantidad, switchporvencer } = this.state; // eslint-disable-line max-len
    if (infoload !== true) {
      return (
        <ReactLoading type="spin" delay={0} color="#97b0c1" height={30} width={30} />
      );
    }

    const handleChangeCuentaSel = (e) => {
      this.setState({ cuentaid: e.target.value });
    };

    const handleChangeMercaSel = (e) => {
      this.setState({ mercaid: e.target.value });
    };

    const handleChangeValor = (e) => {
      this.setState({ valor: e.target.value });
    };

    const handleChangeDate = (edate) => {
      this.setState({ datevencer: edate });
    };

    const handleChangeCantidad = (e) => {
      this.setState({ cantidad: e.target.value });
    };

    const cantidadIsError = (_val) => {
      if (_val === '') {
        return true;
      }
      return false;
    };

    const mercaIsError = (_val) => {
      if (_val === '') {
        return true;
      }
      return false;
    };

    const valorIsError = (_val) => {
      if (_val === '' || isNaN(_val * 1)) {
        return true;
      }
      return false;
    };

    const cuentaIsError = (_val) => {
      if (_val === '') {
        return true;
      }
      return false;
    };

    const handleChangePorVencer = () => {
      if (switchporvencer) {
        this.setState({ switchporvencer: false });
      } else {
        this.setState({ switchporvencer: true });
      }
    };

    const clickSubmit = () => {
      let errorok = false;
      if (!sending) {
        this.setState({ sending: true, formerror: true });
        if (mercaIsError(mercaid)) {
          errorok = true;
        }
        if (cantidadIsError(cantidad)) {
          errorok = true;
        }
        if (extra.typeform === 'agregar') {
          if (cuentaIsError(cuentaid)) {
            errorok = true;
          }
          if (valorIsError(valor)) {
            errorok = true;
          }
        }
      }

      const _cuentaid = cuentaid;
      const _mercaid = mercaid;
      const _cantidad = cantidad;
      const _valor = valor;
      const _switchporvencer = switchporvencer;

      if (!errorok) {
        let _objadd = {
          cuentaid: _cuentaid,
          mercaid: _mercaid,
          cantidad: _cantidad,
          valor: _valor,
          switchporvencer: _switchporvencer,
        };

        if (_objadd.switchporvencer === true) {
          _objadd.datevencer = datevencer;
        }

        if (extra.typeform === 'quitar') {
          _objadd = {
            mercaid: _mercaid,
            cantidad: _cantidad,
          };
        }

        let arrtemp = this.props.objcompra;

        if (this.props.superi != null) {
          arrtemp[this.props.superi] = _objadd;
        } else {
          arrtemp = arrtemp.concat([_objadd]);
        }
        if (this.props) {
          this.props.handlerAddMerca(arrtemp);
        }
      } else {
        this.setState({ sending: false });
      }
    };
    /* eslint-disable max-len */
    return (
      <div className="animated fadeIn">
        <Helmet title={extra.name} />
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <CardBlock className="card-body">
                <Row>
                  <Col xs="12">
                    <FormGroup color={(formerror && mercaIsError(mercaid) ? 'danger' : null)}>
                      <Label htmlFor="ccmerca">Mercaderia</Label>
                      <Input type="select" id="ccmerca" value={mercaid} onChange={handleChangeMercaSel}>
                        <option disabled defaultValue>Selecciona una Mercaderia</option>
                        {mercalist.map(itemmerca => (
                          <option value={itemmerca.idmerca} key={itemmerca.idmerca}>{itemmerca.nametarget}</option> // eslint-disable-line max-len
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12">
                    <FormGroup color={(formerror && cantidadIsError(cantidad) ? 'danger' : null)}>
                      <Label htmlFor="cccantidad">Cantidad</Label>
                      <Input type="text" id="cccantidad" className="form-control-danger" placeholder="Cantidad" required value={cantidad} onChange={handleChangeCantidad} />
                    </FormGroup>
                  </Col>
                </Row>
                {(extra.typeform === 'quitar') ? null : <div>
                  <Row>
                    <Col xs="12">
                      <FormGroup color={(formerror && cuentaIsError(cuentaid) ? 'danger' : null)}>
                        <Label htmlFor="cccuenta">Cuenta</Label>
                        <Input type="select" id="cccuenta" value={cuentaid} onChange={handleChangeCuentaSel}>
                          <option disabled defaultValue>Selecciona una Cuenta</option>
                          {cuentalist.map(itemcuenta => (
                            <option value={itemcuenta.idtarget} key={itemcuenta.idtarget}>{itemcuenta.nametarget}</option> // eslint-disable-line max-len
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12">
                      <FormGroup color={(formerror && valorIsError(valor) ? 'danger' : null)}>
                        <Label htmlFor="ccvalor">Valor</Label>
                        <Input type="text" id="ccvalor" className="form-control-danger" placeholder="Valor" required value={valor} onChange={handleChangeValor} />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12">
                      <FormGroup>
                        <Label htmlFor="ccnota">Por Vencer</Label>
                        <Label className="float-right switch switch-3d switch-primary">
                          <Input type="checkbox" className="switch-input" value={switchporvencer} onChange={handleChangePorVencer} />
                          <span className="switch-label" />
                          <span className="switch-handle" />
                        </Label>
                      </FormGroup>
                    </Col>
                  </Row>
                  {(switchporvencer === true) ? <FormDateSel value={datevencer} onChange={handleChangeDate} /> : null}
                </div>}
              </CardBlock>
              <CardFooter>
                <Button type="submit" size="sm" color="primary" onClick={clickSubmit}><i className="fa fa-dot-circle-o mr-2" />Agregar</Button>
                <Button type="submit" size="sm" color="danger" onClick={clickClose} className="float-right"><i className="fa fa-dot-circle-o mr-2" />Cancelar</Button>
              </CardFooter>
            </Card>
          </Col>
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
  if (utilfetch.cuentas.data !== undefined && utilfetch.mercaderia.data !== undefined) { // eslint-disable-line max-len
    _infoload = true;
  }

  const props = {
    idlocal: local.id,
    mercalist: sortLocal(utilfetch.mercaderia.data, local.id),
    cuentalist: getCuentas(utilfetch.cuentas.data),
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

export default connector(FormAdd);
