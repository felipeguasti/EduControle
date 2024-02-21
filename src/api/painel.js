const express = require('express');
const router = express.Router();
const DisponibilidadeController = require('../controllers/disponibilidadeController');

// Rota para verificar a disponibilidade de horários
router.get('/:recurso', DisponibilidadeController.buscarHorariosDisponiveis);
router.get('/quantidade/:recurso', DisponibilidadeController.getQuantidadeRecurso);


module.exports = router;
