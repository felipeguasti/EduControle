// src/api/disponibilidade.js

const express = require('express');
const router = express.Router();
const DisponibilidadeController = require('../controllers/disponibilidadeController');

// Rota para verificar a disponibilidade de horários
router.get('/:recurso/horarios', DisponibilidadeController.buscarHorariosDisponiveis);

// Rota para buscar reservas por semana
router.get('/:recurso/semana', DisponibilidadeController.buscarReservasPorSemanaPainel);

// Rota para deletar uma reserva específica
router.delete('/reservas/:id', DisponibilidadeController.deletarReserva);

// Rota para obter a quantidade de recursos disponíveis
router.get('/quantidade/:recurso', DisponibilidadeController.getQuantidadeRecurso);

module.exports = router;
