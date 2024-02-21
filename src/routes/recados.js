const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Recado = require('../models/recado');

// POST request to create a new recado
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
        const novoRecado = new Recado(req.body);
        const recadoSalvo = await novoRecado.save();
        res.status(201).json(recadoSalvo);
    } catch (error) {
        res.status(400).json({ message: `Erro ao criar recado: ${error.message}` });
    }
});

// GET request to fetch all recados
router.get('/', async (req, res) => {
    try {
        const recados = await Recado.find();
        res.json(recados);
    } catch (error) {
        res.status(500).json({ message: `Erro ao buscar recados: ${error.message}` });
    }
});

// Middleware para obter recado por ID e implementação de log
async function getRecadoById(req, res, next) {
    let recado;
    try {
        recado = await Recado.findById(req.params.id);
        if (recado == null) {
            return res.status(404).json({ message: 'Recado não encontrado.' });
        }
    } catch (error) {
        return res.status(500).json({ message: `Erro ao buscar recado: ${error.message}` });
    }
    res.recado = recado;
    next();
}

// PUT request to update recado by ID
router.put('/:id', getRecadoById, async (req, res) => {
    Object.assign(res.recado, req.body);
    try {
        const updatedRecado = await res.recado.save();
        res.json(updatedRecado);
    } catch (error) {
        res.status(400).json({ message: `Erro ao atualizar recado: ${error.message}` });
    }
});

// DELETE request to delete recado by ID
router.delete('/:id', getRecadoById, async (req, res) => {
    try {
        await res.recado.remove();
        res.json({ message: 'Recado deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: `Erro ao excluir recado: ${error.message}` });
    }
});

module.exports = router;
