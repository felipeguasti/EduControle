const Sequelize = require('sequelize');

const sequelize = new Sequelize("u612973268_broadcast", "u612973268_broadcast", "E1=iTrLXsvk", {
    host: "195.35.61.61",
    dialect: "mysql",
    logging: false,
});

sequelize.authenticate()
    .then(() => console.log('Conexão com MySQL estabelecida com sucesso!'))
    .catch(err => console.error('Erro ao conectar ao MySQL:', err));

module.exports = sequelize;
