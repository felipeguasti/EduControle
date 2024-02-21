const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./src/config/db'); // Importação do arquivo db.js

// Importação de rotas
const reservasRoutes = require('./src/api/reservas');
const recadosRoutes = require('./src/routes/recados');
const anunciosRoutes = require('./src/routes/anuncios'); // Importação da nova rota de anúncios
const painelRoutes = require('./src/api/painel');
const disponibilidadeRoutes = require('./src/api/disponibilidade');
const disponibilidadeController = require('./src/controllers/disponibilidadeController');

const app = express();

process.env.TZ = 'America/Sao_Paulo';

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static('./src/public'));

// Configura o Express para usar EJS como template engine
app.set('view engine', 'ejs');
app.set('views', './src/views'); // Define o diretório das views

// Conexão com o MongoDB
db.connectToMongoDB()
    .then((database) => {
        // Definindo as rotas após a conexão com o banco de dados
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
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Erro ao conectar ao MongoDB:', err);
        process.exit(1); // Encerra o processo com um código de erro
    });

// Session configuration
app.use(session({
    secret: 'pizz@123',  // Replace with a real secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to true if using https
}));

// Importing new controllers and routes for authentication and user management
//const authController = require('./src/controllers/AuthController');
//const usuariosController = require('./src/controllers/UsuariosController');
//const authRoutes = require('./src/routes/auth');
//const usuariosRoutes = require('./src/routes/usuarios');

// Using new routes
//app.use('/auth', authRoutes);
//app.use('/usuarios', usuariosRoutes);
