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
  personallist: Object,
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
    personallist: {},
    goDeleteData: () => {},
    getLists: () => {},
    goSendData: () => {},
    goSendNotification: () => {},
    infoload: false,
    extra: {},
  };

  state = {
    personallist: this.props.personallist,
    idpersonal: '',
    namePersonal: '',
    sueldoPersonal: '',
    lastnamePersonal: '',
    sending: false,
    formerror: false,
    infoload: false,
  }

  componentDidMount() {
    this.loadAllData();
    this.checkId(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { personallist, idpersonal } = this.state;
    const newobj = { };
    let sendok = false;

    if (personallist !== nextProps.personallist) {
      sendok = true;
      newobj.personallist = nextProps.personallist;
    }

    if (idpersonal !== nextProps.match.params.id) {
      sendok = true;
      newobj.idpersonal = nextProps.match.params.id;
    }

    if (sendok === true) {
      this.checkId(nextProps, newobj);
    }
  }

  componentWillUnmount() { }

  loadAllData = () => {
    const { getLists } = this.props;
    getLists(actionFetch.goGetPersonalParam(0));
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
        _objestate.namePersonal = '';
        _objestate.lastnamePersonal = '';
        _objestate.sueldoPersonal = '';
        _objestate.idpersonal = undefined;
        this.loadAllData();
      }
    }

    const { match, personallist } = _props;
    const { idpersonal } = this.state;
    let changename = true;
    if (personallist.length > 0 && match.params.id !== idpersonal && !_objestate.idpersonal) {
      changename = true;
      _objestate.idpersonal = match.params.id;
    }

    if (changename) {
      let i;
      const n = personallist.length;
      let cuentaoka = false;
      for (i = 0; i < n; i += 1) {
        if (personallist[i].idpersonal === match.params.id) {
          cuentaoka = true;
          _objestate.namePersonal = personallist[i].nombre;
          _objestate.lastnamePersonal = personallist[i].lastname;
          _objestate.sueldoPersonal = personallist[i].sueldo;
        }
      }
      if (!cuentaoka) {
        console.log('error no hay personal');
      }
    }

    if (changename || infi) {
      this.setState(_objestate);
    }
  };

  renderUserList = (): Element<any> => {
    const { infoload, extra, goSendData, goSendNotification, history, match, goDeleteData, getLists, idlocal } = this.props; // eslint-disable-line max-len
    const { sending, formerror, namePersonal, sueldoPersonal, lastnamePersonal } = this.state; // eslint-disable-line max-len
    if (infoload !== true) {
      return (
        <ReactLoading type="spin" delay={0} color="#97b0c1" height={30} width={30} />
      );
    }

    const handleChangenamePersonal = (e) => {
      this.setState({ namePersonal: e.target.value });
    };

    const handleChangesueldoPersonal = (e) => {
      this.setState({ sueldoPersonal: e.target.value });
    };

    const handleChangelastname = (e) => {
      this.setState({ lastnamePersonal: e.target.value });
    };

    const namePersonalIsError = (_val) => {
      if (_val === '' || _val.length <= 1) {
        return true;
      }
      return false;
    };

    const sueldoIsError = (_val) => {
      if (_val === '' || Number(_val) < 1) {
        return true;
      }
      return false;
    };

    const lastnamePersonalIsError = (_val) => {
      if (_val === '' || _val.length <= 1) {
        return true;
      }
      return false;
    };

    const submitResponse = (res) => {
      console.log('res add / update cuenta');
      console.log(res);
      goDeleteData(actionFetch.goGetPersonalDelete());
      if (match.params.id) {
        goSendNotification({ msj: 'Personal Actualizado!' });
      } else {
        goSendNotification({ msj: 'Personal Agregado!' });
      }
      getLists(actionFetch.goGetPersonalParam(0));

      history.push('/rrhh/personal/lista');
    };

    const clickBackCuenta = () => {
      history.push('/rrhh/personal/lista');
    };

    const clickSubmit = () => {
      let errorok = false;
      if (!sending) {
        this.setState({ sending: true, formerror: true });

        if (namePersonalIsError(namePersonal)) {
          errorok = true;
        }
        if (lastnamePersonalIsError(lastnamePersonal)) {
          errorok = true;
        }
        if (sueldoIsError(namePersonal)) {
          errorok = true;
        }
        if (!errorok) {
          const querystring = {
            name: namePersonal,
            lastname: lastnamePersonal,
            sueldobase: sueldoPersonal,
          };
          if (match.params.id) {
            querystring.idpersonal = match.params.id;
          }
          querystring.idlocal = idlocal;
          goSendData({
            service: 'aws',
            method: 'rrhhpersonaladd',
            query: querystring,
          })
            .then((res) => {
              submitResponse(res.data.response);
            })
            .catch((error) => {
              console.log(error);
              console.log('error add personal');
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
                    <FormGroup color={(formerror && namePersonalIsError(namePersonal) ? 'danger' : null)}>
                      <Label htmlFor="ccnamePersonal">Nombre</Label>
                      <Input type="text" id="ccnamePersonal" className="form-control-danger" placeholder="Nombre" required value={namePersonal} onChange={handleChangenamePersonal} />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup color={(formerror && lastnamePersonalIsError(lastnamePersonal) ? 'danger' : null)}>
                      <Label htmlFor="cclastnamePersonal">Apellido</Label>
                      <Input type="text" id="cclastnamePersonal" className="form-control-danger" placeholder="Apellido" required value={lastnamePersonal} onChange={handleChangelastname} />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup color={(formerror && sueldoIsError(sueldoPersonal) ? 'danger' : null)}>
                      <Label htmlFor="ccsueldoPersonal">Sueldo</Label>
                      <Input type="text" id="ccsueldoPersonal" className="form-control-danger" placeholder="Sueldo base" required value={sueldoPersonal} onChange={handleChangesueldoPersonal} />
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
    goDeleteData: (_name: String) => dispatch(actionFetch.deleteData(_name)),
    getLists: (_param:Object) => dispatch(actionFetch.addData(_param)),
    goSendData: (_objsend: Object, _mas:any) => dispatch(actionFetch.goSendData(_objsend, _mas)),
    goSendNotification: (_param:any) => dispatch(actionNotification.sendNotification(_param)),
  }),
);

export default withRouter(connector(FormAdd));
