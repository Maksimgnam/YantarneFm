const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'YantarneFM API',
      version: '1.0.0',
      description: 'Документація до API',
    },
    servers: [
      {
        url: `http://localhost:2000`,
      },
    ],
  },
  apis: ['./src/**/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;