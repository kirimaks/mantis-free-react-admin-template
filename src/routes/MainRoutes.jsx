import { lazy } from 'react';
import { redirect } from 'react-router-dom';

import { CheckAuth } from 'components/auth/CheckAuth';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const TestComponent = Loadable(lazy(() => import('pages/test/index')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <CheckAuth component={ Dashboard } />,
  children: [
    {
      path: '/',
      element: <CheckAuth component={ DashboardDefault } />
    },
    {
      path: 'color',
      element: <CheckAuth component={ Color } />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <CheckAuth component={ DashboardDefault } />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <CheckAuth component={ SamplePage } />
    },
    {
      path: 'shadow',
      element: <CheckAuth component={ Shadow } />
    },
    {
      path: 'typography',
      element: <CheckAuth component={ Typography } />
    },
    {
      path: 'test',
      element: <TestComponent />
    }
  ]
};

export default MainRoutes;
