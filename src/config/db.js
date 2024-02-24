const mongoose = require('mongoose');

// URL de conexão com o MongoDB
const mongoURI = 'mongodb://mainUser:NybpcAomtf6AuOSb@ec2-18-222-20-25.us-east-2.compute.amazonaws.com:27017/equipreserve';

// Conexão com o MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexão com MongoDB estabelecida com sucesso!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

module.exports = mongoose.connection;
