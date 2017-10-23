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

import FormDateSel from '../../Utils/FormDateSelector';
import type { Reducer, Dispatch } from '../../../types';
import { getCuentas } from '../../../utils/appUtils';
import * as actionFetch from '../../../utils/fetch/action';
import * as actionNotification from '../../../utils/notification/action';

type Props = {
  idlocal: Number,
  cuentalist: Object,
  goDeleteData: () => void,
  getLists: () => void,
  goSendData: () => void,
  goSendNotification: () => void,
  infoload: Boolean,
  extra: Object,
  history: PropTypes.object.isRequired,
};

// Export this for unit testing more easily
export class FormAdd extends PureComponent {
  props: Props;

  static defaultProps: {
    idlocal: '',
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
    valor: '',
    datecur: '',
    nota: '',
    switchporvencer: false,
    sending: false,
    formerror: false,
    infoload: false,
  }

  componentDidMount() {
    this.loadAllData();
    this.loadinfo(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { cuentalist } = this.state;
    const newobj = { };
    let sendok = false;

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

    this.setState(_objestate);
  }

  renderUserList = (): Element<any> => {
    const { infoload, extra, idlocal, goSendData, goSendNotification, history, goDeleteData } = this.props; // eslint-disable-line max-len
    const { sending, formerror, cuentalist, cuentaid, valor, datecur, nota, switchporvencer } = this.state; // eslint-disable-line max-len
    if (infoload !== true) {
      return (
        <ReactLoading type="spin" delay={0} color="#97b0c1" height={30} width={30} />
      );
    }

    const handleChangeCuentaSel = (e) => {
      this.setState({ cuentaid: e.target.value });
    };

    const handleChangeValor = (e) => {
      this.setState({ valor: e.target.value });
    };

    const handleChangeDate = (edate) => {
      this.setState({ datecur: edate });
    };

    const handleChangeNota = (e) => {
      this.setState({ nota: e.target.value });
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

    const submitResponse = (res) => {
      if (res === 'ok') {
        if (extra.type === 0 && switchporvencer) {
          goDeleteData(actionFetch.goGetFinanzasPorVencerDelete());
          goSendNotification({ msj: 'Gasto Por Vencer Agregado!' });
        } else if (extra.type === 0) {
          goDeleteData(actionFetch.goGetFinanzasGastosDelete());
          goSendNotification({ msj: 'Gasto Agregado!' });
        } else {
          goDeleteData(actionFetch.goGetFinanzasGananciasDelete());
          goSendNotification({ msj: 'Ganancia Agregada!' });
        }

        history.push('/');
      }
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

        if (cuentaIsError(cuentaid)) {
          errorok = true;
        }

        if (valorIsError(valor)) {
          errorok = true;
        }

        const _valor = valor;

        if (!errorok) {
          let querystring = {
            valor: _valor,
            uid: 'usuarioid',
            idtarget: cuentaid,
            idtype: extra.type,
            date: datecur.getTime(),
          };

          if (extra.type === 0 && switchporvencer) {
            querystring = {
              valor: _valor,
              uid: 'usuarioid',
              idtarget: cuentaid,
              date: datecur.getTime(),
            };
          }

          querystring.idlocal = idlocal;

          if (nota !== '') {
            querystring.note = nota;
          }

          if (extra.type === 0 && switchporvencer) {
            goSendData({
              service: 'aws',
              method: 'pvadd',
              query: querystring,
            })
              .then((res) => {
                submitResponse(res.data.response);
              })
              .catch((error) => {
                console.log(error);
                console.log('error de login');
              });
          } else {
            goSendData({
              service: 'aws',
              method: 'valoresadd',
              query: querystring,
            })
              .then((res) => {
                submitResponse(res.data.response);
              })
              .catch((error) => {
                console.log(error);
                console.log('ganancia add !!error!!');
              });
          }
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
                <FormDateSel value={datecur} onChange={handleChangeDate} />
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
                      <Label htmlFor="ccnota">Nota</Label>
                      <Input type="text" id="ccnota" placeholder="Nota" required value={nota} onChange={handleChangeNota} />
                    </FormGroup>
                  </Col>
                </Row>
                {(extra.type === 0) ? <Row>
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
                </Row> : null}
              </CardBlock>
              <CardFooter>
                <Button type="submit" size="sm" color="primary" onClick={clickSubmit}><i className="fa fa-dot-circle-o mr-2" />Agregar</Button>
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
  if (utilfetch.cuentas.data !== undefined) { // eslint-disable-line max-len
    _infoload = true;
  }

  const props = {
    idlocal: local.id,
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
