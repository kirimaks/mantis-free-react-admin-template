import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from 'contexts/auth/AuthContext';

import { AUTH_INFO_KEY } from 'config';


const CheckAuth:React.FC = ({ component: Component }):JSX.Element => {
    const authContext = useContext(AuthContext);

    if (authContext.isAuthenticated) {
        return <Component />;

    } else {
        return <Navigate to="/login" replace />;
    }
}

export { CheckAuth }
