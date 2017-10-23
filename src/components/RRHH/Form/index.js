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
import { sortLocal } from '../../../utils/appUtils';
import * as actionFetch from '../../../utils/fetch/action';
import * as actionNotification from '../../../utils/notification/action';

type Props = {
  idlocal: Number,
  personallist: Object,
  goDeleteData: () => void,
  getLists: () => void,
  goSendData: () => void,
  goSendNotification: () => void,
  infoload: Boolean,
  extra: Object,
  history: PropTypes.object.isRequired,
};

// Export this for unit testing more easily
export class FormPagar extends PureComponent {
  props: Props;

  static defaultProps: {
    idlocal: '',
    personallist: {},
    goDeleteData: () => {},
    getLists: () => {},
    goSendData: () => {},
    goSendNotification: () => {},
    infoload: false,
    extra: {},
  };

  state = {
    personallist: [],
    idpersonal: '',
    valor: '',
    datecur: '',
    nota: '',
    sending: false,
    formerror: false,
    infoload: false,
  }

  componentDidMount() {
    this.loadAllData();
    this.checklist(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { personallist } = this.state;
    const newobj = { };
    let sendok = false;

    if (personallist !== nextProps.personallist) {
      sendok = true;
      newobj.personallist = nextProps.personallist;
    }

    if (sendok === true) {
      this.checklist(nextProps, newobj);
    }
  }

  loadAllData = () => {
    const { getLists } = this.props;
    getLists(actionFetch.goGetPersonalParam(0));
  }

  checklist = (_props, _newobj) => {
    let newobj = {};
    if (_newobj) {
      newobj = _newobj;
    }

    const { infoload } = this.state;
    if (infoload !== _props.infoload) {
      newobj.infoload = _props.infoload;

      if (infoload === true && _props.infoload === false) {
        this.loadAllData();
      }
    }

    const { extra } = this.props;
    const { personallist, idlocal } = _props;
    let _personallist = personallist;
    if (extra.type === 0) {
      _personallist = sortLocal(personallist, idlocal);
    }
    newobj.personallist = _personallist;

    this.setState(newobj);
  }

  componentWillUnmount() { }

  renderUserList = (): Element<any> => {
    const { infoload, extra, idlocal, goSendData, goSendNotification, history, goDeleteData } = this.props; // eslint-disable-line max-len
    const { sending, formerror, personallist, idpersonal, valor, datecur, nota } = this.state; // eslint-disable-line max-len
    if (infoload !== true) {
      return (
        <ReactLoading type="spin" delay={0} color="#97b0c1" height={30} width={30} />
      );
    }

    const handleChangeCuentaSel = (e) => {
      this.setState({ idpersonal: e.target.value });
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

    const personalIsError = (_val) => {
      if (_val === '') {
        return true;
      }
      return false;
    };

    const submitResponse = (res) => {
      console.log(res);
      goDeleteData(actionFetch.goGetFinanzasGastosDelete());
      goDeleteData(actionFetch.goGetPersonalDelete());
      if (extra.type === 0) {
        goSendNotification({ msj: 'Pago Mensual Listo!' });
      } else if (extra.type === 1) {
        goSendNotification({ msj: 'Pago Adelanto!' });
      } else {
        goSendNotification({ msj: 'Pago Extra!' });
      }

      history.push('/');
    };

    const clickSubmit = () => {
      let errorok = false;
      if (!sending) {
        this.setState({ sending: true, formerror: true });

        if (personalIsError(idpersonal)) {
          errorok = true;
        }

        if (valorIsError(valor)) {
          errorok = true;
        }

        if (!errorok) {
          const _valor = valor;
          const _idpersonal = idpersonal;
          const _idlocal = idlocal;

          let _cuentaid = '1497210520657JPDMK';

          if (extra.type === 1) {
            _cuentaid = '1497213832162WIAKS';
          } else if (extra.type === 2) {
            _cuentaid = '149763362162HKSV';
          }

          const querystring = {
            date: datecur.getTime(),
            uid: 'usuarioid',
            idtarget: _cuentaid,
            valor: _valor,
            typecombo: extra.type,
            idpersonal: _idpersonal,
            idlocal: _idlocal,
          };

          if (nota !== '') {
            querystring.note = nota;
          }

          goSendData({
            service: 'aws',
            method: 'rrhhpersonalcomboadd',
            query: querystring,
          })
            .then((res) => {
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

    /* eslint-disable max-len */
    return (
      <div className="animated fadeIn">
        <Helmet title={extra.name} />
        <Row>
          <Col xs="12" sm="8" lg="6">
            <Card>
              <CardBlock className="card-body">
                <Row>
                  <Col xs="12">
                    <FormGroup color={(formerror && personalIsError(idpersonal) ? 'danger' : null)}>
                      <Label htmlFor="cccuenta">Personal</Label>
                      <Input type="select" id="cccuenta" value={idpersonal} onChange={handleChangeCuentaSel}>
                        <option disabled defaultValue>Selecciona personal</option>
                        {personallist.map(itemcuenta => (
                          <option value={itemcuenta.idpersonal} key={itemcuenta.idpersonal}>{itemcuenta.nombre + ' ' + itemcuenta.lastname}</option> // eslint-disable-line prefer-template
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
              </CardBlock>
              <CardFooter>
                <Button type="submit" size="sm" color="primary" onClick={clickSubmit}><i className="fa fa-dot-circle-o mr-2" />Pagar</Button>
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
  if (utilfetch.personal.data !== undefined) { // eslint-disable-line max-len
    _infoload = true;
  }

  const props = {
    idlocal: local.id,
    personallist: utilfetch.personal.data,
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

export default withRouter(connector(FormPagar));
