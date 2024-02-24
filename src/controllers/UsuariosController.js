const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Controlador para adicionar um novo usuário
exports.adicionarUsuario = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const queryString = 'SELECT * FROM Usuario WHERE email = ?';
        db.query(queryString, [email], async (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (result.length > 0) {
                return res.status(400).send('Usuário já existe.');
            }
            const hashedSenha = await bcrypt.hash(senha, 10);
            const insertString = 'INSERT INTO Usuario (nome, email, senha) VALUES (?, ?, ?)';
            db.query(insertString, [nome, email, hashedSenha], (insertErr, insertResult) => {
                if (insertErr) {
                    return res.status(500).send(insertErr.message);
                }
                res.status(201).send('Usuário criado com sucesso.');
            });
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Outros controladores para atualizar e deletar usuários
