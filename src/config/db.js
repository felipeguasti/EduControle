const { MongoClient } = require('mongodb');

// URL de conexão com o MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

// Função para conectar ao MongoDB
async function connectToMongoDB() {
    try {
        const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Conexão com MongoDB estabelecida com sucesso!');
        return client.db(); // Retorna a referência para o banco de dados
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
        throw err; // Lança o erro para ser tratado pelo chamador
    }
}

module.exports = connectToMongoDB;
