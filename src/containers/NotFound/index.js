/* @flow */

import React from 'react';
import Helmet from 'react-helmet';

export default () => (
  <div className="error">
    <Helmet title="Oops - Error 404" />
    <p>Oops, Page was not found!</p>
  </div>
);
