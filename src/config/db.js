const mongoose = require('mongoose');

// URL de conexão com o MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://atlas-sql-65d4e1a0c6c9a87766f45303-zsuox.a.query.mongodb.net/equipreserve?ssl=true&authSource=admin';

// Conexão com o MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexão com MongoDB estabelecida com sucesso!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

module.exports = mongoose.connection;
