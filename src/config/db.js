const mongoose = require('mongoose');

// URL de conexão com o MongoDB
const mongoURI = 'mongodb+srv://${DB_USER}:${DB_PASS}@${process.env.MONGODB_URI}';

// Conexão com o MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexão com MongoDB estabelecida com sucesso!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

module.exports = mongoose.connection;
