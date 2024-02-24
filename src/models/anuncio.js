
const mongoose = require('mongoose');

const anuncioSchema = new mongoose.Schema({
    tituloAnuncio: String,
    conteudoAnuncio: String,
    dataPublicacao: Date,
});

module.exports = mongoose.model('Anuncio', anuncioSchema);
