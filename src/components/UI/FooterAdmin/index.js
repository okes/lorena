/* eslint-disable react/sort-comp */
/* @flow */

import React from 'react';

const FooterAdmin = () => (
  <footer className="app-footer">
    <span className="float-right">Desarrollado por <a href="http://okes.cl">OKES</a></span>
  </footer>
);

FooterAdmin.defaultProps = {
  auth: {
    id: '',
    name: '',
  },
};

export default FooterAdmin;

