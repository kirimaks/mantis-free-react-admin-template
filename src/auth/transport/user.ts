import { gql, request } from 'graphql-request';

import { getGQLError } from 'errors/transport';


async function createUser(payload) {
    console.log(`Creating user: ${JSON.stringify(payload)}`);

    const url = import.meta.env.VITE_BACKEND_URL;
    const query = gql`
        mutation signUp(
            $email:String! $password:String! $confirm:String! 
            $firstName:String! $lastName:String! $accountName:String!
        ) { 
            signUp(
                email: $email password:$password confirm:$confirm firstName:$firstName 
                lastName:$lastName accountName: $accountName
            ) {
                message
            }
        }
    `;

    const vars = { 
        email: payload.email,
        password: payload.password,
        // confirm: payload.passwordConfirm,
        confirm: payload.password,
        firstName: payload.firstName,
        lastName: payload.lastName,
        accountName: payload.accountName,
    };  

    try {
        return await request(url, query, vars);

    } catch(error) {
        throw getGQLError(error);
    }
}


async function signIn(payload) {
    console.log(`SignIn (payload): ${JSON.stringify(payload)}`);

    const url = import.meta.env.VITE_BACKEND_URL;
    const query = gql`
        mutation signIn($email:String! $password:String!) {
            signIn(email: $email password: $password) { 
                jwtToken, user { firstName, lastName, email } 
            }
        }
    `;

    const vars = { 
        email: payload.email, 
        password: payload.password 
    };  

    try {
        return await request(url, query, vars);

    } catch(error) {
        throw getGQLError(error);
    }
}

export { createUser, signIn }
