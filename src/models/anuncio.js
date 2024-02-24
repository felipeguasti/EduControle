const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Anuncio = db.define('Anuncio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tituloAnuncio: {
    type: DataTypes.STRING,
    allowNull: true
  },
  conteudoAnuncio: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dataPublicacao: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = Anuncio;
