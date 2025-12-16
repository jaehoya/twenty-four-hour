const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'TFH API',
        description: 'Automatically generated API documentation',
        version: '1.0.0',
    },
    host: 'localhost:4000',
    schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
