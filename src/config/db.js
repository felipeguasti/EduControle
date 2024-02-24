const { Sequelize } = require('sequelize');

// Configuração da conexão com o MySQL
const sequelize = new Sequelize('u612973268_broadcast', 'u612973268_broadcast', 'E1=iTrLXsvk', {
  host: '195.35.61.61',
  dialect: 'mysql',
  logging: false
});

// Testar a conexão
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com MySQL estabelecida com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao MySQL:', error);
  }
}

// Testar a conexão
testConnection();

module.exports = sequelize;
