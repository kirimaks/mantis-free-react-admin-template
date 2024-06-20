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

async function createNewTagGroup(authKey:string, payload:{ newTagGroupName, newTagGroupIcon }) {
    const url = import.meta.env.VITE_BACKEND_URL;
    const client = new GraphQLClient(url, {
        headers: {
            'Authorization': `Bearer ${authKey}`
        }
    });

    const query = gql`
        mutation createTagGroup($name: String! $iconName: String!) {
            createTagGroup(name: $name iconName: $iconName) {
                id name
            }
        }
    `;

    const vars = {
        name: payload.newTagGroupName,
        iconName: payload.newTagGroupIcon,
    };

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        return await client.request(query, vars);

    } catch(error) {
        throw getGQLError(error);
    }
}

async function deleteTagGroup(authKey:string, payload: { tagGroupId: string }) {
    const url = import.meta.env.VITE_BACKEND_URL;
    const client = new GraphQLClient(url, {
        headers: {
            'Authorization': `Bearer ${authKey}`
        }
    });

    const query = gql`
        mutation deleteTagGroup($tagGroupId: String!) {
            deleteTagGroup(tagGroupId: $tagGroupId) {
                status
            }
        }
    `;

    const vars = {
        tagGroupId: payload.tagGroupId,
    };

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        return await client.request(query, vars);

    } catch(error) {
        throw getGQLError(error);
    }
}

export { getTags, createNewTagGroup, deleteTagGroup }
