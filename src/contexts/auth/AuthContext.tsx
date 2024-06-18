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

type LogInResponse = {
    signIn: {
        jwtToken: string;
    },
    user: {
        firstName: string;
        lastName: string;
        email: string;
    }
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

function setAuthContext(authContext:{setAuthInfo: () => void}, logInResponse:LogInResponse):void {
    const token = logInResponse.signIn.jwtToken;

    if (token && token.length > 12) {
        const authInfo = {
            authKey: token,
            authEnds: Date.now() + (60000 * 5), // TODO: return from api
            firstName: logInResponse.signIn.user.firstName,
            lastName: logInResponse.signIn.user.lastName,
            email: logInResponse.signIn.user.email,
        };

        window.localStorage.setItem(AUTH_INFO_KEY, JSON.stringify(authInfo));

        authContext.setAuthInfo(authInfo);

    } else {
        throw new Error('Bad response from server');
    }
}


function resetAuthContext(authContext: { setAuthInfo: () => void }):void {
    authContext.setAuthInfo({});
    localStorage.clear(AUTH_INFO_KEY);
}


export { AuthContext, getInitialAuthContext, setAuthContext, resetAuthContext }
