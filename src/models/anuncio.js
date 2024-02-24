const Sequelize = require('sequelize');
const db = require('../config/db');

const Anuncio = db.define('Anuncio', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tituloAnuncio: {
    type: Sequelize.STRING
  },
  conteudoAnuncio: {
    type: Sequelize.STRING
  },
  dataPublicacao: {
    type: Sequelize.DATE
  }
}, {
  timestamps: false, // Se não desejar timestamps created_at e updated_at
  tableName: 'anuncios' // Definindo o nome da tabela como "anuncios"
});

module.exports = Anuncio;
