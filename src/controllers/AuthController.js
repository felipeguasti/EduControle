const { query } = require('express');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Controlador para login do usuário
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const queryString = 'SELECT * FROM Usuario WHERE email = ?';
        db.query(queryString, [email], async (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (result.length === 0) {
                return res.status(401).send('Credenciais inválidas.');
            }
            const usuario = result[0];
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).send('Credenciais inválidas.');
            }
            // Configurar sessão de usuário (implementação pendente)
            res.send('Usuário logado com sucesso.');
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
