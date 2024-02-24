const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Ajuste o caminho conforme necessário
const validator = require('validator');

class Recado extends Model {}

Recado.init({
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    get() {
      const valor = this.getDataValue('data');
      return valor ? valor.toISOString().substring(0,10) : null;
    }
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [0, 100]
    }
  },
  conteudo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [0, 280]
    }
  },
  imagem: {
    type: DataTypes.STRING,
    validate: {
      isUrlOrNull(value) {
        if (value !== null && !validator.isURL(value)) {
          throw new Error('URL inválida');
        }
      }
    }
  },
  turno: {
    type: DataTypes.ENUM,
    values: ['Matutino', 'Vespertino', 'Integral'],
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'Recado',
  timestamps: true,
  getterMethods: {
    dataFormatada() {
      return this.data ? this.data.toISOString().substring(0, 10) : null;
    }
  }
});

module.exports = Recado;
