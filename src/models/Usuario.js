const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Ajuste o caminho conforme necessário
const bcrypt = require('bcryptjs');

class Usuario extends Model {}

Usuario.init({
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  funcao: {
    type: DataTypes.ENUM,
    values: ['administrador', 'usuario'],
    defaultValue: 'usuario'
  }
}, {
  sequelize,
  modelName: 'Usuario',
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.senha) {
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.senha) {
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
      }
    }
  }
});

module.exports = Usuario;
