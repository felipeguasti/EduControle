
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/UsuariosController');

// Rota para adicionar um novo usuário
router.post('/', usuariosController.adicionarUsuario);

// Outras rotas para atualizar e deletar usuários

module.exports = router;
