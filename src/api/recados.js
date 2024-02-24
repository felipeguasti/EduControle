const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../config/db');

// Middleware para autenticação simples usando chave de API
function verificaAutenticacao(req, res, next) {
    const apiChave = 'pizz@123'; // Substitua com sua chave de API
    const chaveFornecida = req.headers['x-api-key'];

    if (!chaveFornecida || chaveFornecida !== apiChave) {
        return res.status(401).json({ message: 'Acesso não autorizado.' });
    }
    next();
}

// POST request to create a new recado
router.post('/', verificaAutenticacao,
    [ // Validações
        body('titulo').isLength({ max: 100 }).withMessage('Título muito longo.'),
        body('conteudo').isLength({ max: 280 }).withMessage('Conteúdo muito longo.')
        // Adicione mais validações conforme necessário
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { titulo, conteudo } = req.body;
            const queryString = 'INSERT INTO Recado (titulo, conteudo) VALUES (?, ?)';
            db.query(queryString, [titulo, conteudo], (err, result) => {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }
                res.status(201).json({ id: result.insertId, titulo, conteudo });
            });
        } catch (error) {
            res.status(400).json({ message: `Erro ao criar recado: ${error.message}` });
        }
    }
);

// GET request to fetch all recados
router.get('/', async (req, res) => {
    try {
        const queryString = 'SELECT * FROM Recado';
        db.query(queryString, (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.json(result);
        });
    } catch (error) {
        res.status(500).json({ message: `Erro ao buscar recados: ${error.message}` });
    }
});

// Middleware para obter recado por ID
async function getRecadoById(req, res, next) {
    const recadoId = req.params.id;
    try {
        const queryString = 'SELECT * FROM Recado WHERE id = ?';
        db.query(queryString, [recadoId], (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            if (result.length === 0) {
                return res.status(404).json({ message: 'Recado não encontrado' });
            }
            res.recado = result[0];
            next();
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// PUT request to update recado by ID
router.put('/:id', verificaAutenticacao, getRecadoById, async (req, res) => {
    Object.assign(res.recado, req.body);
    try {
        const { titulo, conteudo } = req.body;
        const queryString = 'UPDATE Recado SET titulo = ?, conteudo = ? WHERE id = ?';
        db.query(queryString, [titulo, conteudo, req.params.id], (err, result) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            res.json({ message: 'Recado atualizado com sucesso' });
        });
    } catch (error) {
        res.status(400).json({ message: `Erro ao atualizar recado: ${error.message}` });
    }
});

// DELETE request to delete recado by ID
router.delete('/:id', verificaAutenticacao, getRecadoById, async (req, res) => {
    try {
        const queryString = 'DELETE FROM Recado WHERE id = ?';
        db.query(queryString, [req.params.id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.json({ message: 'Recado deletado com sucesso' });
        });
    } catch (error) {
        res.status(500).json({ message: `Erro ao excluir recado: ${error.message}` });
    }
});

module.exports = router;
