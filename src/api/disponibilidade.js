// src/api/disponibilidade.js

const express = require('express');
const router = express.Router();
const DisponibilidadeController = require('../controllers/disponibilidadeController');

// Rota para verificar a disponibilidade de horários
router.get('/:recurso', DisponibilidadeController.buscarHorariosDisponiveis);
router.get('/:recurso', DisponibilidadeController.buscarReservasPorSemanaPainel);
router.delete('/reservas/:id', DisponibilidadeController.deletarReserva);
router.get('/quantidade/:recurso', DisponibilidadeController.getQuantidadeRecurso);

module.exports = router;
