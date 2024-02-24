const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const Usuario = db.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
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
    type: DataTypes.ENUM('administrador', 'usuario'),
    defaultValue: 'usuario'
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

// Middleware para hash de senha antes de salvar
Usuario.beforeCreate(async (usuario, options) => {
  const hashedPassword = await bcrypt.hash(usuario.senha, 10);
  usuario.senha = hashedPassword;
});

module.exports = Usuario;
