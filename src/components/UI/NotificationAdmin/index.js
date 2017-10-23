/* eslint-disable react/sort-comp */
/* @flow */

import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import type { Auth as AuthType, Notification as NotificationType, Reducer } from '../../../types';
import NAlert from '../../Utils/NotificationAlert';
import { cloneArray } from '../../../utils/appUtils';

type Props = {
  auth: AuthType,
  notification: NotificationType,
};

// Export this for unit testing more easily
export class NotificationAdmin extends PureComponent {
  props: Props;

  static defaultProps: {
    auth: {},
    notification: {},
  };

  state = {
    notificationOpen: false,
    alertone: [],
  };

  componentDidMount() { }

  componentWillReceiveProps(nextProps) {
    const { alertone } = this.state;
    const { checkAddNewNotification } = this;
    if (nextProps.notification.alertone !== undefined && checkAddNewNotification(nextProps.notification.alertone.createdate, alertone)) { // eslint-disable-line max-len
      const newarr = cloneArray(alertone);
      newarr.unshift(nextProps.notification.alertone);
      this.setState({ alertone: newarr });
    }
  }

  checkAddNewNotification = (iddata, arrdata) => {
    const n = arrdata.length;
    if (n > 0) {
      let i;
      for (i = 0; i < n; i += 1) {
        if (arrdata[i].createdate === iddata) {
          return false;
        }
      }
    }
    return true;
  }

  renderUserList = (): Element<any> => {
    const { notificationOpen, alertone } = this.state;
    const asd = true;
    if (!asd) {
      console.log(notificationOpen);
    }
    const newalert = (_onealert) => {
      if (_onealert.param && _onealert.param.msj) {
        return (
          <NAlert key={_onealert.createdate} color={(_onealert.param.color) ? _onealert.param.color : 'info'} msj={_onealert.param.msj} /> // eslint-disable-line max-len
        );
      }
      return null;
    };

    return (
      <div className="main fixed-bottom pl-2 pr-2" >
        {alertone.map(_alertmap => newalert(_alertmap))}
      </div>
    );
  }

  render() {
    const { renderUserList } = this;
    const { auth } = this.props;
    return (
      (auth.signedIn) ? renderUserList() : null
    );
  }
}

const connector: Connector<{}, Props> = connect(
  ({ auth, notification }: Reducer) => ({ auth, notification }),
  () => ({ }),
);

export default connector(NotificationAdmin);
