import { createContext } from 'react';

import { AUTH_INFO_KEY } from 'config';

const AuthContext = createContext();

type AuthInfo = {
    authKey: string;
    authEnds: number;
    firstName: string;
    lastName: string;
    email: string;
};

function getInitialAuthContext(): AuthInfo {
    let authInfo = window.localStorage.getItem(AUTH_INFO_KEY);
    console.log(`Auth info: ${authInfo}, ${typeof authInfo}`);

    if (authInfo && typeof authInfo === 'string') {
        try {
            authInfo = JSON.parse(authInfo);
            const { authKey, authEnds, firstName, lastName, email } = authInfo;

            console.log(`AuthKey: ${authKey}, ${typeof authKey}`);
            console.log(`AuthEnds: ${authEnds}, ${typeof authEnds}`);
            console.log(`Auth valid: ${authEnds > Date.now()}`);

            if (authKey && authKey.length) {
                if (authEnds && authEnds > Date.now()) {
                    return {
                        authKey, authEnds, firstName, lastName, email
                    };
                }
            }

        } catch(error) {
            console.error(`Cannot parse auth info: ${error.message}`);
        }
    }

    return {};
}

export { AuthContext, getInitialAuthContext }
