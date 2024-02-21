
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// Controlador para adicionar um novo usuário
exports.adicionarUsuario = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).send('Usuário já existe.');
        }
        const usuario = new Usuario({ nome, email, senha });
        await usuario.save();
        res.status(201).send('Usuário criado com sucesso.');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Outros controladores para atualizar e deletar usuários
