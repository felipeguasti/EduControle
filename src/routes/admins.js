
const express = require('express');
const router = express.Router();
const anunciosController = require('../controllers/anunciosController');


router.get('/', anunciosController.listarAnuncios);
router.post('/', anunciosController.criarAnuncios);

module.exports = router;
