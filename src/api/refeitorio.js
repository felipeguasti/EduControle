const express = require('express');
const router = express.Router();
const refeitorioController = require('../controllers/refeitorioController');

// Rota para listar informativos (refeições)
router.get('/', refeitorioController.listarInformativos);

// Rota para criar um novo informativo (refeição)
router.post('/', refeitorioController.criarInformativo);

// Rota para atualizar um informativo existente (refeição)
router.put('/:id', refeitorioController.atualizarInformativo);

// Rota para deletar um informativo (refeição)
router.delete('/:id', refeitorioController.deletarInformativo);

// Rota para renderizar a página de administração do refeitório
router.get('/refeitorio', refeitorioController.renderAdminRefeitorio);

module.exports = router;
