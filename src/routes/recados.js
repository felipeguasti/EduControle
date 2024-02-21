const express = require('express');
const router = express.Router();
const RecadoController = require('../controllers/recadoController');

// Rota para listar todos os recados
router.get('/', RecadoController.listarRecados);

// Rota para criar um novo recado
// TODO: Adicionar validação de dados
// TODO: Adicionar autenticação
router.post('/', RecadoController.criarRecado);

// Rota para buscar um recado específico pelo ID
router.get('/:id', RecadoController.buscarRecadoPorId);

// Rota para atualizar um recado pelo ID
// TODO: Adicionar validação de dados
// TODO: Adicionar autenticação
router.put('/:id', RecadoController.atualizarRecado);

// Rota para deletar um recado pelo ID
// TODO: Adicionar autenticação
router.delete('/:id', RecadoController.deletarRecado);

module.exports = router;
