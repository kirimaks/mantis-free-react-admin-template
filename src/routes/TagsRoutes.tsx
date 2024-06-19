import { lazy } from 'react';

import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

import { CheckAuth } from 'components/auth/CheckAuth';


const Tags = Loadable(lazy(() => import('pages/tags/Tags')));

const TagsRoutes = {
    path: '/',
    element: <CheckAuth component={ Dashboard } />,
    children: [
        {
            path: '/tags',
            element: <CheckAuth component={ Tags } />,
        }
    ]
};

export default TagsRoutes;
