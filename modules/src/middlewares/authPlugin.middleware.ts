const Jwt = require('hapi-auth-jwt2');
const jwt = require('jsonwebtoken');
import dotenv from 'dotenv';
dotenv.config();

const authPlugin = {
    name: "jwt-authentication",
    version:'1.0.0',
    register: async function(server:any, options:any) {
        await server.register(Jwt);

        server.auth.strategy('user', 'jwt', {
            key: process.env.SECRET_KEY,
            validate: async (decoded: any, request:any, h:any) => {
                request.user = decoded;
                return {isValid : true};
            }
        });
        // server.auth.default('user');

    }
}

export default authPlugin;