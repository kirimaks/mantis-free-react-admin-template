import { GraphQLClient, gql } from 'graphql-request';

import { getGQLError } from 'errors/transport';


async function getProfileInfo(authKey:string) {
    const url = import.meta.env.VITE_BACKEND_URL;
    const client = new GraphQLClient(url, {
        headers: {
            'Authorization': `Bearer ${authKey}`
        }
    });
    const query = gql`
        query {
            profile {
                user {
                    firstName lastName email
                }
                account {
                    name
                }
            }
        }
    `;

    try {
        return await client.request(query);

    } catch(error) {
        throw new getGQLError(error);
    }
}

async function updateProfileInfo(authKey:string, payload) {
    const url = import.meta.env.VITE_BACKEND_URL;
    const client = new GraphQLClient(url, {
        headers: {
            'Authorization': `Bearer ${authKey}`
        }
    });
    const query = gql`
        mutation updateProfile($firstName:String $lastName:String) {
            updateProfile(firstName: $firstName lastName: $lastName) {
                user { firstName lastName email }
            }
        }
    `;

    const vars = {
        firstName: payload.firstName,
        lastName: payload.lastName
    };

    try {
        return await client.request(query, vars);

    } catch(error) {
        throw getGQLError(error);
    }
}

export { getProfileInfo, updateProfileInfo }
