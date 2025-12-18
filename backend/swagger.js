const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'TFH API',
        description: 'Automatically generated API documentation',
        version: '1.0.0',
    },
    host: process.env.SWAGGER_HOST || "localhost:4000",
    schemes: [process.env.SWAGGER_SCHEME || "http"],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
