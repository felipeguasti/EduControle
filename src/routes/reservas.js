const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const ReservaController = require('../controllers/reservaController');
const verificaAutenticacao = require('../middleware/authorization');
const db = require('../config/db');

// Rota para listar todas as reservas
router.get('/', ReservaController.listarReservas);

// Rota para criar uma nova reserva
router.post('/', verificaAutenticacao, [
  body('data').isISO8601().withMessage('Data inválida.'),
  body('recurso').isMongoId().withMessage('ID do recurso inválido.'),
  body('professor').isMongoId().withMessage('ID do professor inválido.'),
  body('turma').isMongoId().withMessage('ID da turma inválido.'),
  body('horario').not().isEmpty().withMessage('Horário é obrigatório.')
], ReservaController.criarReserva);

// Rota para buscar uma reserva específica pelo ID
router.get('/:id', ReservaController.buscarReservaPorId);

// Rota para atualizar uma reserva pelo ID
router.put('/:id', verificaAutenticacao, [
  body('data').optional().isISO8601().withMessage('Data inválida.'),
  body('recurso').optional().isMongoId().withMessage('ID do recurso inválido.'),
  // Repetir validações para outros campos conforme necessário
], ReservaController.atualizarReserva);

// Rota para deletar uma reserva pelo ID
router.delete('/:id', verificaAutenticacao, ReservaController.deletarReserva);

module.exports = router;
