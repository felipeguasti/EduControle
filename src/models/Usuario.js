const Sequelize = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const Usuario = db.define('Usuario', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  senha: {
    type: Sequelize.STRING,
    allowNull: false
  },
  funcao: {
    type: Sequelize.ENUM('administrador', 'usuario'),
    defaultValue: 'usuario'
  }
}, {
  timestamps: false,
  tableName: 'usuarios',
  hooks: {
    beforeCreate: async (usuario, options) => {
      const hashedSenha = await bcrypt.hash(usuario.senha, 10);
      usuario.senha = hashedSenha;
    },
    beforeUpdate: async (usuario, options) => {
      if (usuario.changed('senha')) {
        const hashedSenha = await bcrypt.hash(usuario.senha, 10);
        usuario.senha = hashedSenha;
      }
    }
  }
});

module.exports = Usuario;
