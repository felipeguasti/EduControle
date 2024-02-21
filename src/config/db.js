const { MongoClient } = require('mongodb');

// URL de conexão com o MongoDB
const mongoURI = process.env.MONGODB_URI;

// Função para conectar ao MongoDB
async function connectToMongoDB() {
    try {
        const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Conexão com MongoDB estabelecida com sucesso!');
        return client.db(); // Retorna o objeto do banco de dados
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
        throw err; // Rejeita a promessa com o erro
    }
}

module.exports = connectToMongoDB;
