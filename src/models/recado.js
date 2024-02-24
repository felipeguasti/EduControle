const Sequelize = require('sequelize');
const db = require('../config/db');

const Recado = db.define('Recado', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  data: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    get() {
      // Retorna apenas a data no formato YYYY-MM-DD
      return this.getDataValue('data').toISOString().split('T')[0];
    }
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [1, 100] // Limita o título a 100 caracteres
    }
  },
  conteudo: {
    type: Sequelize.STRING(280), // Limita o conteúdo a 280 caracteres
    allowNull: false
  },
  imagem: {
    type: Sequelize.STRING,
    validate: {
      isURL: true // Valida se é uma URL válida
    }
  },
  turno: {
    type: Sequelize.ENUM('Matutino', 'Vespertino', 'Integral'),
    allowNull: false
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'recados' // Definindo o nome da tabela como "recados"
});

module.exports = Recado;
