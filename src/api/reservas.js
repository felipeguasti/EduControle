const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectToMongoDB = require('../config/db');

// Função para obter a coleção de reservas do banco de dados
async function getReservasCollection() {
    const db = await connectToMongoDB();
    return db.collection('reservas');
}

// POST request para criar uma nova reserva
router.post('/', 
  [ // Validações
    body('data').isISO8601().withMessage('Data inválida.'),
    body('turno').isIn(['Matutino', 'Vespertino']).withMessage('Turno inválido.'),
    // Adicione mais validações conforme necessário
  ], 
  async (req, res) => {
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

// GET request para buscar todas as reservas
router.get('/', async (req, res) => {
  try {
      const reservasCollection = await getReservasCollection();
      const reservas = await reservasCollection.find().toArray();
      res.json(reservas);
  } catch (error) {
      res.status(500).json({ message: `Erro ao buscar reservas: ${error.message}` });
  }
});

// GET request para buscar reserva por ID
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

// Middleware para obter reserva por ID e implementação de log
async function getReservaById(req, res, next) {
  const reservaId = req.params.id;
  try {
      const reservasCollection = await getReservasCollection();
      const reserva = await reservasCollection.findOne({ _id: ObjectId(reservaId) });
      if (!reserva) {
          return res.status(404).json({ message: 'Reserva não encontrada.' });
      }
      res.reserva = reserva;
      next();
  } catch (error) {
      return res.status(500).json({ message: `Erro ao buscar reserva: ${error.message}` });
  }
}

// PUT request para atualizar reserva por ID
router.put('/:id', getReservaById, async (req, res) => {
  // Atualização parcial
  const reservaId = req.params.id;
  try {
      const reservasCollection = await getReservasCollection();
      await reservasCollection.updateOne({ _id: ObjectId(reservaId) }, { $set: req.body });
      res.json({ message: 'Reserva atualizada com sucesso' });
  } catch (error) {
      res.status(400).json({ message: `Erro ao atualizar reserva: ${error.message}` });
  }
});

// DELETE request para excluir reserva por ID
router.delete('/:id', getReservaById, async (req, res) => {
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
