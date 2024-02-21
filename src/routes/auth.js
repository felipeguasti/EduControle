
const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

// Rota para login do usuário
router.post('/login', authController.login);

// Rota para logout do usuário (implementação pendente)

module.exports = router;
