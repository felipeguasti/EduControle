const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Importação de rotas
const reservasRoutes = require('./src/api/reservas');
const recadosRoutes = require('./src/routes/recados');
const anunciosRoutes = require('./src/routes/anuncios'); // Importação da nova rota de anúncios
const painelRoutes = require('./src/api/painel'); 
const disponibilidadeRoutes = require('./src/api/disponibilidade');
const disponibilidadeController = require('./src/controllers/disponibilidadeController');
const db = require('./src/config/db');

const app = express();

process.env.TZ = 'America/Sao_Paulo'; // Definindo o fuso horário para São Paulo

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos 
app.use(express.static('./src/public'));

// Configura o Express para usar EJS como template engine
app.set('view engine', 'ejs');
app.set('views', './src/views');  // Define o diretório das views

// Definindo as rotas
app.use('/api/reservas', reservasRoutes);
app.use('/api/recados', recadosRoutes);
app.use('/admin', anunciosRoutes); // Rota de administração para anúncios
app.use('/api/disponibilidade', disponibilidadeRoutes);
app.use('/reservas', disponibilidadeRoutes);
app.use('/painel', painelRoutes);

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
