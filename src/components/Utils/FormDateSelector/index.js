/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';


type Props = {
  value: Number,
  onChange: () => void,
};

// Export this for unit testing more easily
export class FormDateSelector extends PureComponent {
  props: Props;

  static defaultProps: {
    value: '',
    onChange : () => {},
  };

  state = {
    value: this.props.value,
    isday: '',
    ismonth: '',
    isyear: '',
  }

  componentDidMount() {
    this.setDate(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.state;
    const newobj = { };
    let sendok = false;

    if (value !== nextProps.value) {
      sendok = true;
      newobj.value = nextProps.value;
    }

    if (sendok === true) {
      this.setDate(nextProps);
    }
  }

  componentWillUnmount() { }

  setDate = (props) => {
    if (props.value && props.value !== undefined) {
      this.setState({ value: props.value, isday: props.value.getDate(), ismonth: props.value.getMonth(), isyear: props.value.getFullYear() }); // eslint-disable-line max-len
    } else {
      const newdate = new Date();
      this.setState({ value: newdate, isday: newdate.getDate(), ismonth: newdate.getMonth(), isyear: newdate.getFullYear() }); // eslint-disable-line max-len
      this.goHandler(newdate.getDate(), newdate.getMonth(), newdate.getFullYear());
    }
  }

  goHandler = (day, mon, yea) => {
    const newdate = new Date();
    const getHour = newdate.getHours();
    const getMin = newdate.getMinutes();
    const getSec = newdate.getSeconds();
    const getMilSec = newdate.getHours();
    const nnye = new Date(Number(yea), Number(mon), Number(day), getHour, getMin, getSec, getMilSec); // eslint-disable-line max-len
    this.props.onChange(nnye);
  }

  renderUserList = (): Element<any> => {
    const { value, ismonth, isday, isyear } = this.state;

    if (value === undefined) {
      return <div />;
    }
    const daysInMonth = (month, year) => {
      const dan = new Date(year, month, 0).getDate();
      return dan;
    };
    const handleChangeDay = (e) => {
      this.setState({ isday: e.target.value });
      this.goHandler(e.target.value, ismonth, isyear);
    };
    const handleChangeMonth = (e) => {
      this.setState({ ismonth: e.target.value });
      this.goHandler(isday, e.target.value, isyear);
    };
    const handleChangeYear = (e) => {
      this.setState({ isyear: e.target.value });
      this.goHandler(isday, ismonth, e.target.value);
    };

    let i;
    let ii = 1;
    const arrday = [];
    const n = daysInMonth(ismonth, isyear);
    for (i = 0; i < n; i += 1) {
      arrday.push(ii);
      ii += 1;
    }

    return (
      <Row>
        <Col xs="4">
          <FormGroup>
            <Label htmlFor="ccmonth">Dia</Label>
            <Input type="select" name="ccmonth" id="ccmonth" value={isday} onChange={handleChangeDay}>
              {arrday.map(itemday => (
                <option value={itemday} key={itemday}>{itemday}</option>
              ))}
            </Input>
          </FormGroup>
        </Col>
        <Col xs="4">
          <FormGroup>
            <Label htmlFor="ccmonth">Mes</Label>
            <Input type="select" name="ccmonth" id="ccmonth" value={ismonth} onChange={handleChangeMonth}>
              <option value="0">Enero</option>
              <option value="1">Febrero</option>
              <option value="2">Marzo</option>
              <option value="3">Abril</option>
              <option value="4">Mayo</option>
              <option value="5">Junio</option>
              <option value="6">Julio</option>
              <option value="7">Agosto</option>
              <option value="8">Septiembre</option>
              <option value="9">Octubre</option>
              <option value="10">Noviembre</option>
              <option value="11">Diciembre</option>
            </Input>
          </FormGroup>
        </Col>
        <Col xs="4">
          <FormGroup>
            <Label htmlFor="ccyear">Año</Label>
            <Input type="select" name="ccyear" id="ccyear" value={isyear} onChange={handleChangeYear}>
              <option>2017</option>
              <option>2018</option>
            </Input>
          </FormGroup>
        </Col>
      </Row>
    );
  }

  render() {
    const { renderUserList } = this;
    return (
      renderUserList()
    );
  }
}

const connector: Connector<{}, Props> = connect(
  () => ({ }),
  () => ({ }),
);

export default connector(FormDateSelector);
