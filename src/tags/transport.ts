import { GraphQLClient, gql } from 'graphql-request';

import { getGQLError } from 'errors/transport';


async function getTags(authKey:string) {
    const url = import.meta.env.VITE_BACKEND_URL;
    const client = new GraphQLClient(url, {
        headers: {
            'Authorization': `Bearer ${authKey}`
        }
    }); 

    const query = gql`
        query {
            accountTags {
                id name iconName
                tags {
                    id name iconName
                }
            }
        }
    `;

    try {
        return await client.request(query);

    } catch(error) {
        throw getGQLError(error);
    }   

}

export { getTags }
