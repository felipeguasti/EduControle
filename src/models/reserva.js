const { Model, DataTypes } = require('sequelize');
const sequelize = require('./path/to/your/db.js'); // Atualize com o caminho correto para o seu arquivo db.js

class Reserva extends Model {}

Reserva.init({
  recurso: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'O recurso é obrigatório.' }
    }
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: { msg: 'A data é obrigatória.' },
      isDate: { msg: 'Deve ser uma data válida.' },
      isAfter: { args: String(new Date()), msg: 'A data da reserva não pode ser no passado.' }
    }
  },
  turno: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'O turno é obrigatório.' },
      isIn: {
        args: [['Matutino', 'Vespertino']],
        msg: 'Turno inválido.'
      }
    }
  },
  professor: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'O nome do professor é obrigatório.' }
    }
  },
  turma: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'A turma é obrigatória.' }
    }
  },
  horario: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'O horário é obrigatório.' },
      // Implemente a lógica de validação de horários aqui conforme necessário
    }
  },
  observacoes: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Reserva',
  timestamps: true
});

module.exports = Reserva;
