import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition:{
        openapi: '3.0.0',
        info:{
            title:'MyContacts API',
            version: '1.0.0',
            description: 'An API to Manage contacts with user authentification'
        },
    },
    apis: ['./routes/*.js'],
}

export const specs = swaggerJsdoc(options);