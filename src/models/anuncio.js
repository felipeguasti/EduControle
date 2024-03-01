const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Verifique se o caminho está correto

class Anuncio extends Model {}

Anuncio.init({
  // Defina os campos do modelo
  tituloAnuncio: {
    type: DataTypes.STRING,
    allowNull: false // Verifique se o campo é obrigatório
  },
  conteudoAnuncio: {
    type: DataTypes.STRING,
    allowNull: false // Verifique se o campo é obrigatório
  },
  dataPublicacao: {
    type: DataTypes.DATE,
    allowNull: false // Verifique se o campo é obrigatório
  }
}, {
  sequelize,
  modelName: 'Anuncio', // Verifique se o nome da tabela está correto
  timestamps: false // Desabilita timestamps se não forem necessários
});

module.exports = Anuncio;
