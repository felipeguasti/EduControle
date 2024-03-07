
const express = require('express');
const router = express.Router();
const anunciosController = require('../controllers/anunciosController');

router.put('/editar/:id', anunciosController.atualizarAnuncio);
router.get('/', anunciosController.listarAnuncios);
router.post('/criar', anunciosController.criarAnuncios);
router.get('/mostrar', anunciosController.mostrarAnuncios);
router.get('/recentes', anunciosController.listarAnunciosRecentes);

//Rotas de busca por id do banco de dados
router.get('/total', anunciosController.contarTotalAnuncios);
router.get('/mostrar/:id', anunciosController.obterAnuncioPorId);
router.delete('/:id', anunciosController.deletarAnuncio);
// Rota para renderizar a página de administração do refeitório
router.get('/listar', anunciosController.renderAdminAnuncios);

module.exports = router;
