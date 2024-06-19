import { lazy } from 'react';


import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

import { CheckAuth } from 'components/auth/CheckAuth';


const Transactions = Loadable(lazy(() => import('pages/transactions/Transactions')));


const TransactionsRoutes = {
    path: '/',
    element: <Dashboard />,
    children: [
        {
            path: '/transactions',
            element: <CheckAuth component={ Transactions } />,
        }
    ]
};

export default TransactionsRoutes;
