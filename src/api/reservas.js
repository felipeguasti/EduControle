
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Reserva = require('../models/reserva');
const db = require('../config/db');


// POST request to create a new reserva
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
        const novaReserva = new Reserva(req.body);
        const reservaSalva = await novaReserva.save();
        res.status(201).json({ reservaSalva }); // Modified to include success field
    } catch (error) {
        res.status(400).json({ message: `Erro ao criar reserva: ${error.message}` }); // Modified to include success field
    }
});

// GET request to fetch all reservas
router.get('/', async (req, res) => {
  try {
      const reservas = await Reserva.find();
      res.json(reservas);
  } catch (error) {
      res.status(500).json({ message: `Erro ao buscar reservas: ${error.message}` });
  }
});

// GET request to fetch reserva by ID
router.get('/:id', async (req, res) => {
  const reservaId = req.params.id;
  try {
      const reserva = await Reserva.findByPk(reservaId);
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
  let reserva;
  try {
      reserva = await Reserva.findByPk(req.params.id);
      if (reserva == null) {
          return res.status(404).json({ message: 'Reserva não encontrada.' });
      }
  } catch (error) {
      return res.status(500).json({ message: `Erro ao buscar reserva: ${error.message}` });
  }
  res.reserva = reserva;
  next();
}

// PUT request to update reserva by ID
router.put('/:id', getReservaById, async (req, res) => {
  // Atualização parcial
  Object.assign(res.reserva, req.body);
  try {
      const updatedReserva = await res.reserva.save();
      res.json(updatedReserva);
  } catch (error) {
      res.status(400).json({ message: `Erro ao atualizar reserva: ${error.message}` });
  }
});

// DELETE request to delete reserva by ID
router.delete('/:id', getReservaById, async (req, res) => {
  try {
      console.log(res.reserva);
      await res.reserva.remove();
      res.json({ message: 'Reserva excluída com sucesso' });
  } catch (error) {
      res.status(500).json({ message: `Erro ao excluir reserva: ${error.message}` });
  }
});

module.exports = router;
