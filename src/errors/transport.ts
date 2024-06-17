import { ClientError } from 'graphql-request'


function getGQLError(gqlError:unknown):string {
    console.log(`GQL Error: ${gqlError}`);

    if (gqlError instanceof ClientError) {
        if (gqlError.response.errors) {
            return gqlError.response.errors[0].message;
        }
    }

    if (gqlError instanceof Error) {
        return gqlError.message;
    }

    return 'No response from server';
}

export { getGQLError }
