const express = require('express');
const { body, validationResult } = require('express-validator');
const { MongoClient, ObjectId } = require('mongodb'); // Importa o MongoClient e ObjectId do MongoDB
const router = express.Router();

// Middleware para autenticação simples usando chave de API
function verificaAutenticacao(req, res, next) {
    const apiChave = 'pizz@123'; // Substitua com sua chave de API
    const chaveFornecida = req.headers['x-api-key'];

    if (!chaveFornecida || chaveFornecida !== apiChave) {
        return res.status(401).json({ message: 'Acesso não autorizado.' });
    }
    next();
}

// Função para conectar ao banco de dados
async function connectToDatabase() {
    const uri = 'mongodb://localhost:27017'; // Substitua pela URI do seu banco de dados MongoDB
    const client = new MongoClient(uri);
    await client.connect();
    return client.db('nome_do_banco_de_dados'); // Substitua 'nome_do_banco_de_dados' pelo nome do seu banco de dados
}

// POST request para criar um novo recado
router.post('/', verificaAutenticacao,
    [ // Validações
        body('titulo').isLength({ max: 100 }).withMessage('Título muito longo.'),
        body('conteudo').isLength({ max: 280 }).withMessage('Conteúdo muito longo.'),
        // Adicione mais validações conforme necessário
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const db = await connectToDatabase(); // Conecta ao banco de dados
            const recadoCollection = db.collection('recados'); // Obtém a coleção de recados
            const result = await recadoCollection.insertOne(req.body); // Insere o recado na coleção
            const recadoSalvo = result.ops[0]; // Obtém o recado salvo
            res.status(201).json(recadoSalvo);
        } catch (error) {
            res.status(400).json({ message: `Erro ao criar recado: ${error.message}` });
        }
    });

// GET request para buscar todos os recados
router.get('/', async (req, res) => {
    try {
        const db = await connectToDatabase(); // Conecta ao banco de dados
        const recadoCollection = db.collection('recados'); // Obtém a coleção de recados
        const recados = await recadoCollection.find().toArray(); // Busca todos os recados na coleção
        res.json(recados);
    } catch (error) {
        res.status(500).json({ message: `Erro ao buscar recados: ${error.message}` });
    }
});

// Middleware para obter recado por ID e implementação de log
async function getRecadoById(req, res, next) {
    try {
        const db = await connectToDatabase(); // Conecta ao banco de dados
        const recadoCollection = db.collection('recados'); // Obtém a coleção de recados
        const recado = await recadoCollection.findOne({ _id: new ObjectId(req.params.id) }); // Busca o recado por ID
        if (recado == null) {
            return res.status(404).json({ message: 'Recado não encontrado.' });
        }
        res.recado = recado;
        next();
    } catch (error) {
        return res.status(500).json({ message: `Erro ao buscar recado: ${error.message}` });
    }
}

// PUT request para atualizar recado por ID
router.put('/:id', verificaAutenticacao, getRecadoById, async (req, res) => {
    try {
        const db = await connectToDatabase(); // Conecta ao banco de dados
        const recadoCollection = db.collection('recados'); // Obtém a coleção de recados
        await recadoCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        ); // Atualiza o recado na coleção
        res.json(req.body);
    } catch (error) {
        res.status(400).json({ message: `Erro ao atualizar recado: ${error.message}` });
    }
});

// DELETE request para excluir recado por ID
router.delete('/:id', verificaAutenticacao, getRecadoById, async (req, res) => {
    try {
        const db = await connectToDatabase(); // Conecta ao banco de dados
        const recadoCollection = db.collection('recados'); // Obtém a coleção de recados
        await recadoCollection.deleteOne({ _id: new ObjectId(req.params.id) }); // Deleta o recado na coleção
        res.json({ message: 'Recado deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: `Erro ao excluir recado: ${error.message}` });
    }
});

module.exports = router;
