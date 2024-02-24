const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Recado = db.define('Recado', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100] // Limita o tamanho do título entre 1 e 100 caracteres
    }
  },
  conteudo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 280] // Limita o tamanho do conteúdo entre 1 e 280 caracteres
    }
  },
  imagem: {
    type: DataTypes.STRING,
    allowNull: true, // Permite valores nulos para imagem
    validate: {
      isUrl: true // Valida se é uma URL válida
    }
  },
  turno: {
    type: DataTypes.ENUM('Matutino', 'Vespertino', 'Integral'),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Recado;
