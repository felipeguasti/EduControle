const { MongoClient } = require('mongodb');

// String de conexão com o MongoDB
const mongoURI = 'mongodb+srv://mainUser:pRrjcnKmZQtwXY4o@mongodb://atlas-sql-65d4e1a0c6c9a87766f45303-zsuox.a.query.mongodb.net/equipreserve?ssl=true&authSource=admin';

// Função para conectar ao MongoDB
async function connectToMongoDB() {
    try {
        const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Conexão com MongoDB estabelecida com sucesso!');
        return client.db(); // Retorna o objeto do banco de dados
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
        throw err; // Rejeita a promessa com o erro
    }
}

module.exports = connectToMongoDB;
