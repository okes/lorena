/* @flow */

import type { Dispatch } from './types';
import { fetchUserIfNeeded } from './containers/UserInfo/action';
import HomePage from './containers/Home';
import UserInfoPage from './containers/UserInfo';
import NotFoundPage from './containers/NotFound';

import FormFinanzas from './components/Business/Form';
import IndexHistoriaFinanzasPage from './components/Business/Historial';
import HistoriaFinanzasPage from './components/Business/Historial/finanzas';
import HistoriaFinanzasPorVencerPage from './components/Business/Historial/porvencer';
import IndexCuentasFinanzasPage from './components/Business/Cuentas';
import CuentasFinanzasPage from './components/Business/Cuentas/list';
import CuentasFinanzasAddPage from './components/Business/Cuentas/add';

import FormAddMercaderia from './components/Mercaderia/Form';
import ListMercaderia from './components/Mercaderia/list';
import ListAddMercaderia from './components/Mercaderia/list/add';
import HistorialMercaderia from './components/Mercaderia/historial';
import requireAuthentication from './containers/Auth';

import PersonalList from './components/RRHH/list';
import AddPersonal from './components/RRHH/list/add';
import PersonalPagar from './components/RRHH/Form';

export default [
  {
    path: '/',
    exact: true,
    component: requireAuthentication(HomePage),
    extra: {
      name: 'Inicio',
    },
  },
  {
    path: '/finanzas/agregar-ganancia',
    exact: true,
    component: requireAuthentication(FormFinanzas),
    extra: {
      name: 'Finanzas - Agregar Ganancia',
      type: 1,
    },
  },
  {
    path: '/finanzas/agregar-gasto',
    exact: true,
    component: requireAuthentication(FormFinanzas),
    extra: {
      name: 'Finanzas - Agregar Gastos',
      type: 0,
    },
  },
  {
    path: '/finanzas/historial',
    exact: false,
    component: requireAuthentication(IndexHistoriaFinanzasPage),
    extra: {
      name: 'Finanzas - Historial',
      type: 0,
    },
    routes: [
      {
        path: '/finanzas/historial',
        exact: true,
        component: HistoriaFinanzasPage,
        extra: {
          name: 'Finanzas - Historial (Ganancias y Gastos)',
          type: 0,
        },
      },
      {
        path: '/finanzas/historial/por-vencer',
        exact: true,
        component: HistoriaFinanzasPorVencerPage,
        extra: {
          name: 'Finanzas - Historial (Por Vencer)',
          type: 1,
        },
      },
    ],
  },
  {
    path: '/finanzas/cuentas',
    exact: false,
    component: requireAuthentication(IndexCuentasFinanzasPage),
    extra: {
      name: 'Finanzas - Cuentas',
    },
    routes: [
      {
        path: '/finanzas/cuentas',
        exact: true,
        component: CuentasFinanzasPage,
        extra: {
          name: 'Finanzas - Cuentas',
        },
      },
      {
        path: '/finanzas/cuentas/nueva-cuenta',
        exact: true,
        component: CuentasFinanzasAddPage,
        extra: {
          name: 'Finanzas - Nueva Cuenta',
        },
      },
      {
        path: '/finanzas/cuentas/editar-cuenta/:id',
        exact: true,
        component: CuentasFinanzasAddPage,
        extra: {
          name: 'Finanzas - Editar Cuenta',
        },
      },
    ],
  },
  {
    path: '/mercaderia/agregar-mercaderia',
    exact: true,
    component: requireAuthentication(FormAddMercaderia),
    extra: {
      name: 'Mercaderia - Agregar Mercaderia',
      typeform: 'agregar',
    },
  },
  {
    path: '/mercaderia/quitar-mercaderia',
    exact: true,
    component: requireAuthentication(FormAddMercaderia),
    extra: {
      name: 'Mercaderia - Quitar Mercaderia',
      typeform: 'quitar',
    },
  },
  {
    path: '/mercaderia/lista',
    exact: true,
    component: requireAuthentication(ListMercaderia),
    extra: {
      name: 'Mercaderia - Lista de Mercaderias',
    },
  },
  {
    path: '/mercaderia/nueva-mercaderia',
    exact: true,
    component: requireAuthentication(ListAddMercaderia),
    extra: {
      name: 'Mercaderia - Nueva Mercaderia',
    },
  },
  {
    path: '/mercaderia/editar-mercaderia/:id',
    exact: false,
    component: requireAuthentication(ListAddMercaderia),
    extra: {
      name: 'Mercaderia - Editar Mercaderia',
    },
  },
  {
    path: '/mercaderia/historial',
    exact: true,
    component: requireAuthentication(HistorialMercaderia),
    extra: {
      name: 'Mercaderia - Historial',
    },
  },
  {
    path: '/rrhh/personal/lista',
    exact: true,
    component: requireAuthentication(PersonalList),
    extra: {
      name: 'RRHH - Personal',
    },
  },
  {
    path: '/rrhh/personal/agregar-personal',
    exact: true,
    component: requireAuthentication(AddPersonal),
    extra: {
      name: 'RRHH - Agregar Personal',
    },
  },
  {
    path: '/rrhh/personal/editar-personal/:id',
    exact: false,
    component: requireAuthentication(AddPersonal),
    extra: {
      name: 'RRHH - Editar Personal',
    },
  },
  {
    path: '/rrhh/personal/pagar-sueldo',
    exact: true,
    component: requireAuthentication(PersonalPagar),
    extra: {
      name: 'RRHH - Pagar Sueldo',
      type: 0,
    },
  },
  {
    path: '/rrhh/personal/pagar-adelanto',
    exact: true,
    component: requireAuthentication(PersonalPagar),
    extra: {
      name: 'RRHH - Pagar Adelanto',
      type: 1,
    },
  },
  {
    path: '/rrhh/personal/pagar-extra',
    exact: true,
    component: requireAuthentication(PersonalPagar),
    extra: {
      name: 'RRHH - Pagar Extra',
      type: 2,
    },
  },
  {
    path: '/UserInfo/:id',
    component: requireAuthentication(UserInfoPage),
    loadData: (dispatch: Dispatch, params: Object) => Promise.all([
      dispatch(fetchUserIfNeeded(params.id)),
    ]),
    extra: {
      name: 'user info',
    },
  },
  {
    path: '*',
    component: requireAuthentication(NotFoundPage),
    extra: {
      name: 'Error 404',
    },
  }];
