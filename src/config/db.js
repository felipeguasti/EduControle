const mongoose = require('mongoose');

// URL de conexão com o MongoDB
const mongoURI = 'mongodb+srv://mainUser:NybpcAomtf6AuOSb@atlas-sql-65d6967c33cd836cdb89b5b6-zsuox.a.query.mongodb.net/equipreserve?ssl=true&authSource=admin';

// Conexão com o MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexão com MongoDB estabelecida com sucesso!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

module.exports = mongoose.connection;
