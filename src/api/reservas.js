
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
    console.log('Erro no front');
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
      const reservas = await Reserva.findAll();
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

// Middleware para encontrar reserva por ID
const getReservaById = async (req, res, next) => {
  const reservaId = req.params.id;
  try {
    const reserva = await Reserva.findByPk(reservaId);
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva não encontrada.' });
    }
    req.reserva = reserva; // Atribuir a reserva a req.reserva
    next(); // Chamar next() para passar para a próxima função de middleware ou rota
  } catch (error) {
    res.status(500).json({ message: `Erro ao buscar reserva: ${error.message}` });
  }
};


// PUT request to update reserva by ID
router.put('/:id', getReservaById, async (req, res) => {
    try {
        // Usando req.reserva que foi definido no middleware
        const updatedReserva = await req.reserva.update(req.body);
        res.json(updatedReserva);
    } catch (error) {
        res.status(400).json({ message: `Erro ao atualizar reserva: ${error.message}` });
    }
});

// DELETE request to delete reserva by ID
router.delete('/:id', getReservaById, async (req, res) => {
  try {
    await req.reserva.destroy(); // Excluir a reserva
    res.json({ message: 'Reserva excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: `Erro ao excluir reserva: ${error.message}` });
  }
});

module.exports = router;
