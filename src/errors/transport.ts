import { ClientError } from 'graphql-request'


class UnauthorizedError extends Error {
    constructor(message:string) {
        super(message);
        this.message = message;
        this.name = 'UnauthorizedError';
    }
}


function getGQLError(gqlError:unknown):Error {
    console.log(`GQL Error: ${gqlError}`);

    if (gqlError instanceof ClientError) {
        if (gqlError.response.errors) {

            for (const error of gqlError.response.errors) {
                if (error.message.match(/unauthorized/i)) {
                    console.log('Unauthorized error');
                    return new UnauthorizedError(error.message);
                }
            }

            return new Error(gqlError.response.errors[0].message);
        }
    }

    if (gqlError instanceof Error) {
        return new Error(gqlError.message);
    }

    return new Error('No response from server');
}

export { getGQLError, UnauthorizedError }
