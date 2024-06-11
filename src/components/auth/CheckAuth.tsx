import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from 'contexts/auth/AuthContext';


const CheckAuth:React.FC = ({ component: Component }):JSX.Element => {
    const authContext = useContext(AuthContext);

    if (authContext.isAuthenticated) {
        return <Component />;
    }

    return <Navigate to="/login" replace />;
}

export { CheckAuth }
