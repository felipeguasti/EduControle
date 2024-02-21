const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectToMongoDB = require('../config/db');

// Controlador da reserva
const ReservaController = require('../controllers/reservaController');
// Middleware para verificação de autenticação
const verificaAutenticacao = require('../middleware/authorization');

// Função para obter a coleção de reservas do banco de dados
async function getReservasCollection() {
    const db = await connectToMongoDB();
    return db.collection('reservas');
}

// Rota para listar todas as reservas
router.get('/', async (req, res) => {
    try {
        const reservasCollection = await getReservasCollection();
        const reservas = await reservasCollection.find().toArray();
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ message: `Erro ao listar reservas: ${error.message}` });
    }
});

// Rota para criar uma nova reserva
router.post('/', verificaAutenticacao, [
    body('data').isISO8601().withMessage('Data inválida.'),
    body('recurso').custom((value) => ObjectId.isValid(value)).withMessage('ID do recurso inválido.'),
    body('professor').custom((value) => ObjectId.isValid(value)).withMessage('ID do professor inválido.'),
    body('turma').custom((value) => ObjectId.isValid(value)).withMessage('ID da turma inválido.'),
    body('horario').not().isEmpty().withMessage('Horário é obrigatório.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const reservasCollection = await getReservasCollection();
        const result = await reservasCollection.insertOne(req.body);
        const reservaSalva = result.ops[0];
        res.status(201).json({ reservaSalva }); // Modified to include success field
    } catch (error) {
        res.status(400).json({ message: `Erro ao criar reserva: ${error.message}` }); // Modified to include success field
    }
});

// Rota para buscar uma reserva específica pelo ID
router.get('/:id', async (req, res) => {
    const reservaId = req.params.id;
    try {
        const reservasCollection = await getReservasCollection();
        const reserva = await reservasCollection.findOne({ _id: ObjectId(reservaId) });
        if (!reserva) {
            return res.status(404).json({ message: 'Reserva não encontrada.' });
        }
        res.json(reserva);
    } catch (error) {
        res.status(500).json({ message: `Erro ao buscar reserva: ${error.message}` });
    }
});

// Rota para atualizar uma reserva pelo ID
router.put('/:id', verificaAutenticacao, [
    body('data').optional().isISO8601().withMessage('Data inválida.'),
    body('recurso').optional().custom((value) => ObjectId.isValid(value)).withMessage('ID do recurso inválido.'),
    // Repetir validações para outros campos conforme necessário
], async (req, res) => {
    const reservaId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const reservasCollection = await getReservasCollection();
        await reservasCollection.updateOne({ _id: ObjectId(reservaId) }, { $set: req.body });
        res.json({ message: 'Reserva atualizada com sucesso' });
    } catch (error) {
        res.status(400).json({ message: `Erro ao atualizar reserva: ${error.message}` });
    }
});

// Rota para deletar uma reserva pelo ID
router.delete('/:id', verificaAutenticacao, async (req, res) => {
    const reservaId = req.params.id;
    try {
        const reservasCollection = await getReservasCollection();
        await reservasCollection.deleteOne({ _id: ObjectId(reservaId) });
        res.json({ message: 'Reserva excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ message: `Erro ao excluir reserva: ${error.message}` });
    }
});

module.exports = router;
