const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Atualize com o caminho correto para o seu arquivo db.js
const moment = require('moment');


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
      isNotPastOrFuture: function(value) {
        const currentDate = moment();
        const pastDate = moment(currentDate).subtract(2, 'days'); // Data de ontem
        const maxDate = moment(currentDate).add(30, 'days'); // Adicionando 30 dias à data atual
    
        if (moment(value).isBefore(pastDate)) {
            throw new Error('A data da reserva não pode ser no passado.');
        } else if (moment(value).isAfter(maxDate)) {
            throw new Error('A data da reserva não pode ser mais do que 30 dias no futuro.');
        }
      }    
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
