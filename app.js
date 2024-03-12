const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

// Importação de rotas
const reservasRoutes = require('./src/api/reservas');
const recadosRoutes = require('./src/routes/recados');
const anunciosRoutes = require('./src/routes/anuncios'); // Importação da nova rota de anúncios
const adminsRoutes = require('./src/routes/admins'); // Importação da nova rota de anúncios
const painelRoutes = require('./src/api/painel'); 
const disponibilidadeRoutes = require('./src/api/disponibilidade');
const disponibilidadeController = require('./src/controllers/disponibilidadeController');
const refeitorioRoutes = require ('./src/api/refeitorio');
const db = require('./src/config/db');

const app = express();

process.env.TZ = 'America/Sao_Paulo'; // Definindo o fuso horário para São Paulo

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos 
app.use(express.static('./src/public'));

// Configura o Express para usar EJS como template engine
app.set('view engine', 'ejs');
app.set('views', './src/views');  // Define o diretório das views

// Configuração do Multer
const upload = multer({ 
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '..', 'src', 'public', 'images', 'uploads'));
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.fieldname !== 'imagemFile') {
            return cb(new Error('Campo de arquivo inválido.'));
        }
        cb(null, true);
    }
});

// Definindo as rotas
app.use('/api/reservas', reservasRoutes);
app.use('/api/recados', recadosRoutes);
app.use('/admin', adminsRoutes); // Rota de administração
app.use('/admin/anuncios', anunciosRoutes); // Rota de administração para anúncios
app.use('/api/disponibilidade', disponibilidadeRoutes);
app.use('/reservas', disponibilidadeRoutes);
app.use('/painel', painelRoutes);
app.use('/api/refeitorio', refeitorioRoutes);
app.use('/admin', refeitorioRoutes);

// Rota inicial atualizada para renderizar index.ejs
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/reserva', (req, res) => {
    const recurso = req.query.recurso || 'default value'; // Valor padrão se nenhum parâmetro de consulta for fornecido
    res.render('reserva', { recurso });
});

app.get('/painel', (req, res) => {
    const recurso = req.query.recurso || 'default value'; // Valor padrão se nenhum parâmetro de consulta for fornecido
    res.render('painel', { recurso });
});

// Rota para painel do refeitório
app.get('/refeitorio', (req, res) => {
    res.render('refeitorio');
});

// Configuração para servir arquivos estáticos na pasta 'js'
app.use('/js', express.static(path.join(__dirname, 'src', 'public', 'js')));

// Middleware para registrar requisições
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleString()} - ${req.method} ${req.url}`);
    next();
});

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        console.error('Erro do Multer:', error);
        res.status(400).json({ error: 'Erro de upload de arquivo.' });
    } else {
        console.error('Erro desconhecido:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Nova rota para buscar reservas por semana
app.get('/api/disponibilidade/:recurso/semana', disponibilidadeController.buscarReservasPorSemana);
// Rota para buscar reservas por semana no painel
app.get('/api/disponibilidade/:recurso/painel', disponibilidadeController.buscarReservasPorSemanaPainel);

// Inicializando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
