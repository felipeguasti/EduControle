const express = require('express');
const router = express.Router();
const DisponibilidadeController = require('../controllers/disponibilidadeController');

// Rota para verificar a disponibilidade de horários
router.get('/horarios/:recurso', DisponibilidadeController.buscarHorariosDisponiveis);

// Rota para obter a quantidade de um recurso disponível
router.get('/quantidade/:recurso', DisponibilidadeController.getQuantidadeRecurso);

module.exports = router;
