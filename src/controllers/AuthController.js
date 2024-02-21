
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// Controlador para login do usuário
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).send('Credenciais inválidas.');
        }
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).send('Credenciais inválidas.');
        }
        // Configurar sessão de usuário (implementação pendente)
        res.send('Usuário logado com sucesso.');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Controlador para logout do usuário (implementação pendente)
