const db = require('../config/db'); // Importação do arquivo db.js
const bcrypt = require('bcryptjs');

exports.adicionarUsuario = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const database = await db(); // Conecta ao banco de dados
        const usuariosCollection = database.collection('usuarios');

        const usuarioExistente = await usuariosCollection.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).send('Usuário já existe.');
        }

        const hashedSenha = await bcrypt.hash(senha, 10); // Hash de senha antes de salvar
        await usuariosCollection.insertOne({ nome, email, senha: hashedSenha });

        res.status(201).send('Usuário criado com sucesso.');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Outros controladores para atualizar e deletar usuários
