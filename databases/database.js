const Sequelize = require('sequelize')
const connection = new Sequelize("", "", "", {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    timezone: "-03:00"
});

connection .authenticate()
.then(() => {
    console.log("Conectado com o banco de dados.");
}).catch((error) => {
    console.log("Erro: nõa foi realizada a conexão com o banco de dados.");
});


module.exports = connection;