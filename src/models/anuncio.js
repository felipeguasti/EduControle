const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Ajuste o caminho conforme necessário

class Anuncio extends Model {}

Anuncio.init({
  tituloAnuncio: DataTypes.STRING,
  conteudoAnuncio: DataTypes.STRING,
  dataPublicacao: DataTypes.DATE
}, {
  sequelize,
  modelName: 'Anuncio',
  timestamps: false // Desabilita timestamps se não forem necessários
});

module.exports = Anuncio;
