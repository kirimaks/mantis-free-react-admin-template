import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from 'contexts/auth/AuthContext';

import { AUTH_INFO_KEY } from 'config';


const CheckAuth:React.FC = ({ component: Component }):JSX.Element => {
    const authContext = useContext(AuthContext);

    console.log(`Check auth: ${JSON.stringify(authContext)}`);

    // TODO: check auth expiry
    if (authContext.authInfo.authKey) {
        return <Component />;

    } else {
        return <Navigate to="/login" replace />;
    }
}

export { CheckAuth }
