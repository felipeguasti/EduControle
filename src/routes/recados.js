const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectToMongoDB = require('../config/db');

// Função para obter a coleção de recados do banco de dados
async function getRecadosCollection() {
    const db = await connectToMongoDB();
    return db.collection('recados');
}

// POST request para criar um novo recado
router.post('/', [
    // Validações
    body('titulo').isLength({ max: 100 }).withMessage('Título muito longo.'),
    body('conteudo').isLength({ max: 280 }).withMessage('Conteúdo muito longo.'),
    // Adicione mais validações conforme necessário
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const recadosCollection = await getRecadosCollection();
        const result = await recadosCollection.insertOne(req.body);
        const recadoSalvo = result.ops[0];
        res.status(201).json(recadoSalvo);
    } catch (error) {
        res.status(400).json({ message: `Erro ao criar recado: ${error.message}` });
    }
});

// GET request para buscar todos os recados
router.get('/', async (req, res) => {
    try {
        const recadosCollection = await getRecadosCollection();
        const recados = await recadosCollection.find().toArray();
        res.json(recados);
    } catch (error) {
        res.status(500).json({ message: `Erro ao buscar recados: ${error.message}` });
    }
});

// Middleware para obter recado por ID e implementação de log
async function getRecadoById(req, res, next) {
    const recadoId = req.params.id;
    try {
        const recadosCollection = await getRecadosCollection();
        const recado = await recadosCollection.findOne({ _id: ObjectId(recadoId) });
        if (!recado) {
            return res.status(404).json({ message: 'Recado não encontrado.' });
        }
        res.recado = recado;
        next();
    } catch (error) {
        return res.status(500).json({ message: `Erro ao buscar recado: ${error.message}` });
    }
}

// PUT request para atualizar recado por ID
router.put('/:id', getRecadoById, async (req, res) => {
    const recadoId = req.params.id;
    try {
        const recadosCollection = await getRecadosCollection();
        await recadosCollection.updateOne({ _id: ObjectId(recadoId) }, { $set: req.body });
        res.json({ message: 'Recado atualizado com sucesso' });
    } catch (error) {
        res.status(400).json({ message: `Erro ao atualizar recado: ${error.message}` });
    }
});

// DELETE request para excluir recado por ID
router.delete('/:id', getRecadoById, async (req, res) => {
    const recadoId = req.params.id;
    try {
        const recadosCollection = await getRecadosCollection();
        await recadosCollection.deleteOne({ _id: ObjectId(recadoId) });
        res.json({ message: 'Recado excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: `Erro ao excluir recado: ${error.message}` });
    }
});

module.exports = router;
