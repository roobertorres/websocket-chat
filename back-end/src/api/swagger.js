const swaggerJsDoc = require('swagger-jsdoc')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API do meu projeto',
            version: '1.0.0',
            description: 'Uma API simples para o meu projeto',
        },
        servers: [
            {
                url: 'http://localhost:8081',
            },
        ],
    },
    apis: ['./routes/router.js'], // caminho para os arquivos onde você definiu os endpoints
};

const specs = swaggerJsDoc(options)

module.exports = specs