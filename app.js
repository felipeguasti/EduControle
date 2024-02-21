const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

// Importação de rotas
const reservasRoutes = require('./src/api/reservas');
const recadosRoutes = require('./src/routes/recados');
const anunciosRoutes = require('./src/routes/anuncios'); // Importação da nova rota de anúncios
const painelRoutes = require('./src/api/painel');
const disponibilidadeRoutes = require('./src/api/disponibilidade');
const disponibilidadeController = require('./src/controllers/disponibilidadeController');
const dbConfig = require('./src/config/db'); // Importação do db.js
const app = express();
require('dotenv').config({ path: './.env' }); // Carrega as variáveis de ambiente do arquivo .env

process.env.TZ = 'America/Sao_Paulo';

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static('./src/public'));

// Configura o Express para usar EJS como template engine
app.set('view engine', 'ejs');
app.set('views', './src/views'); // Define o diretório das views

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
app.get('/api/disponibilidade/:recurso/painel', disponibilidadeController.buscarReservasPorSemanaPainel);

// Inicializando o servidor
const PORT = process.env.PORT || 3000;

// Conectando ao banco de dados MongoDB usando MongoClient
MongoClient.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Conectado ao banco de dados');
        const db = client.db(dbConfig.database);
        app.locals.db = db; // Disponibiliza o objeto de banco de dados para o aplicativo

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Erro ao conectar ao banco de dados:', error);
    });
