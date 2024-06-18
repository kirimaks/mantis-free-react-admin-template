import { lazy } from 'react';

import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

import { CheckAuth } from 'components/auth/CheckAuth';


const ViewProfile = Loadable(lazy(() => import('pages/profile/Profile')));
const EditProfile = Loadable(lazy(() => import('pages/profile/EditProfile')));


const ProfileRoutes = {
    path: '/',
    element: <CheckAuth component={ Dashboard } />,
    children: [
        {
            path: '/profile',
            element: <CheckAuth component={ ViewProfile } />,
        },
        {
            path: '/edit-profile',
            element: <CheckAuth component={ EditProfile } />
        }
    ]
};

export default ProfileRoutes;
