const express = require('express');
const router = express.Router();
const refeitorioController = require('../controllers/refeitorioController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'images', 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Rota para listar informativos (refeições)
router.get('/listar', refeitorioController.listarInformativos);

// Rota para criar um novo informativo (refeição)
router.post('/', upload.single('imagemFile'), refeitorioController.criarInformativo);

// Rota para renderizar a página de administração do refeitório
router.get('/total', refeitorioController.calcularTotalPaginas);

// Rota para atualizar um informativo existente (refeição)
router.put('/:id', upload.single('imagemFile'), refeitorioController.atualizarInformativo);

// Rota para deletar um informativo (refeição)
router.delete('/:id', refeitorioController.deletarInformativo);

// Rota para buscar um informativo específico pelo ID
router.get('/:id', refeitorioController.buscarInformativoPorId);

// Rota para renderizar a página de administração do refeitório
router.get('/', refeitorioController.renderAdminRefeitorio);

module.exports = router;
