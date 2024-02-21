const mongoose = require('mongoose');
const validator = require('validator'); // Utilize 'npm install validator' para adicionar esta dependência

const recadoSchema = new mongoose.Schema({
  data: { 
    type: Date, 
    required: true,
    get: valor => valor.toISOString().substring(0,10)
  },
  titulo: { 
    type: String, 
    required: true,
    maxlength: 100
  },
  conteudo: { 
    type: String, 
    required: true,
    maxlength: 280 // Limita o conteúdo ao tamanho de um tweet
  },
  imagem: {
    type: String,
    validate: {
      validator: function(valor) {
        // Permite nulo ou uma string que seja uma URL válida
        return valor == null || validator.isURL(valor);
      },
      message: 'URL inválida'
    }
  },
  turno: {
    type: String,
    required: true,
    enum: ['Matutino', 'Vespertino', 'Integral'],
  },
}, { timestamps: true, toObject: { getters: true }, toJSON: { getters: true } });

const Recado = mongoose.model('Recado', recadoSchema);

module.exports = Recado;
