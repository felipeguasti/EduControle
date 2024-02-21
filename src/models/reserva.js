const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  recurso: {
    type: String,
    required: [true, 'O recurso é obrigatório.']
  },
  data: { 
    type: Date, 
    required: [true, 'A data é obrigatória.'],
    validate: {
      validator: function(value) {
        // Garante que a data da reserva não seja no passado
        return value.getTime() > Date.now();
      },
      message: 'A data da reserva não pode ser no passado.'
    }
  },
  turno: {
    type: String,
    required: [true, 'O turno é obrigatório.'],
    enum: ['Matutino', 'Vespertino']
  },
  professor: {
    type: String,
    required: [true, 'O nome do professor é obrigatório.']
  },
  turma: {
    type: String,
    required: [true, 'A turma é obrigatória.']
  },
  horario: {
    type: String,
    required: [true, 'O horário é obrigatório.'],
    validate: {
      validator: function(value) {
        // Horários para os turnos Matutino e Vespertino
        const horariosMatutino = ['7:00', '7:50', '8:40', '9:50', '10:40', '11:30'];
        const horariosVespertino = ['13:00', '13:50', '14:40', '15:30', '16:40', '17:30'];

        // Verifica se o horário é válido com base no turno
        if (this.turno === 'Matutino') {
          return horariosMatutino.includes(value);
        } else if (this.turno === 'Vespertino') {
          return horariosVespertino.includes(value);
        }
        return false; // Horário inválido se não for Matutino ou Vespertino
      },
      message: 'Horário inválido para o turno selecionado.'
    }
  },
  observacoes: String
}, { timestamps: true });

const Reserva = mongoose.model('Reserva', reservaSchema);

module.exports = Reserva;
