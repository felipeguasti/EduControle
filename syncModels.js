const sequelize = require('./src/config/db'); // Importe a instância do Sequelize com as configurações do seu banco de dados
//const Reserva = require('./src/models/reserva');
//const Recado = require('./src/models/recado');
//const Anuncio = require('./src/models/anuncio');
//const Usuario = require('./src/models/Usuario');
const Refeitorio = require('./src/models/refeitorio');


async function sincronizarModelos() {
  try {
    // Sincroniza os modelos com o banco de dados
    await sequelize.sync({ force: true }); // A opção { force: true } força a sincronização e recria as tabelas

    console.log('Tabelas sincronizadas com sucesso.');
  } catch (error) {
    console.error('Erro ao sincronizar tabelas:', error);
  }
}

sincronizarModelos();
