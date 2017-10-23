const appSecrets = {
  aws: {
    config: {
      region: 'us-east-1',
      userPool: 'us-east-1_OWJwsoBxz',
      identityPool: 'us-east-1:84dbfb4e-1206-4372-bc88-f6e569ed3b9f',
      clientId: '5pfgvlqfgoppo7a6sp6o60duj7',
      group: 'admins',
    },
    urlapi: 'https://xnkznu8ez1.execute-api.us-east-1.amazonaws.com/TMCtest/',
    api: {
      mercaderiacomboget: 'mercaderia/combo',
      mercaderiacomboadd: 'mercaderia/combo/add',
      mercaderiacomboquitar: 'mercaderia/combo/quitar',
      mercaderiacombodelete: 'mercaderia/combo/delete',
      mercaderiaget: 'mercaderia',
      mercaderiaadd: 'mercaderia/add',
      mercaderiadelete: 'mercaderia/delete',
      cuentasget: 'cuentas',
      cuentasadd: 'cuentas/add',
      cuentasdelete: 'cuentas/delete',
      pvget: 'finanzas/porvencer',
      pvadd: 'finanzas/porvencer/add',
      pvdelete: 'finanzas/porvencer/delete',
      pvpay: 'finanzas/porvencer/cuota/pay',
      pvcuotasget: 'finanzas/porvencer/cuota',
      valoresadd: 'finanzas/valores/add',
      valoresdelete: 'finanzas/valores/delete',
      valoresdeletereverse: 'finanzas/valores/delete/reverse',
      getfinanzas: 'finanzas/valores',
      rrhhpersonalget: 'rrhh/personal',
      rrhhpersonaladd: 'rrhh/personal/add',
      rrhhpersonaldelete: 'rrhh/personal/delete',
      rrhhpersonalcomboadd: 'rrhh/personal/combo/add',
    },
  },
};

export default appSecrets;
