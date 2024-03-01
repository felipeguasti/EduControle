
const express = require('express');
const router = express.Router();
const anunciosController = require('../controllers/anunciosController');


router.get('/', anunciosController.listarAnuncios);
router.post('/', anunciosController.criarAnuncios);
router.get('/anuncios', anunciosController.mostrarAnuncios);
router.get('/anuncios/recentes', anunciosController.listarAnunciosRecentes);

//Rotas de busca por id do banco de dados
router.get('/anuncios/total', anunciosController.contarTotalAnuncios);
router.get('/anuncios/:id', anunciosController.obterAnuncioPorId);
router.put('/anuncios/:id', anunciosController.atualizarAnuncio);
router.delete('/anuncios/:id', anunciosController.deletarAnuncio);

module.exports = router;
