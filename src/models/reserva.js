const Sequelize = require('sequelize');
const db = require('../config/db');

const Reserva = db.define('Reserva', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  recurso: {
    type: Sequelize.STRING,
    allowNull: false
  },
  data: {
    type: Sequelize.DATE,
    allowNull: false,
    validate: {
      isAfter: {
        args: [new Date().toDateString()],
        msg: 'A data da reserva não pode ser no passado.'
      }
    }
  },
  turno: {
    type: Sequelize.ENUM('Matutino', 'Vespertino'),
    allowNull: false
  },
  professor: {
    type: Sequelize.STRING,
    allowNull: false
  },
  turma: {
    type: Sequelize.STRING,
    allowNull: false
  },
  horario: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isValidHorario(value) {
        const horariosMatutino = ['7:00', '7:50', '8:40', '9:50', '10:40', '11:30'];
        const horariosVespertino = ['13:00', '13:50', '14:40', '15:30', '16:40', '17:30'];

        if (this.turno === 'Matutino') {
          if (!horariosMatutino.includes(value)) {
            throw new Error('Horário inválido para o turno selecionado.');
          }
        } else if (this.turno === 'Vespertino') {
          if (!horariosVespertino.includes(value)) {
            throw new Error('Horário inválido para o turno selecionado.');
          }
        } else {
          throw new Error('Horário inválido.');
        }
      }
    }
  },
  observacoes: Sequelize.TEXT
}, {
  timestamps: true,
  underscored: true,
  tableName: 'reservas' // Definindo o nome da tabela como "reservas"
});

module.exports = Reserva;
