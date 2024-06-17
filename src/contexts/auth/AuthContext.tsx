import { createContext } from 'react';

import { AUTH_INFO_KEY } from 'config';

const AuthContext = createContext();

function getInitialAuthContext():boolean {
    let authInfo = window.localStorage.getItem(AUTH_INFO_KEY);
    console.log(`Auth info: ${authInfo}, ${typeof authInfo}`);

    if (authInfo && typeof authInfo === 'string') {
        try {
            authInfo = JSON.parse(authInfo);
            const { authKey, authEnds } = authInfo;

            console.log(`AuthKey: ${authKey}, ${typeof authKey}`);
            console.log(`AuthEnds: ${authEnds}, ${typeof authEnds}`);
            console.log(`Auth valid: ${authEnds > Date.now()}`);

            if (authKey && authKey.length) {
                if (authEnds && authEnds > Date.now()) {
                    // console.log('Set as authenticated');
                    // authContext.setIsAuthenticated(true);
                    return true;
                }
            }

        } catch(error) {
            console.error(`Cannot parse auth info: ${error.message}`);
        }
    }

    return false;
}

export { AuthContext, getInitialAuthContext }
