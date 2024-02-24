const { Usuario } = require('../models'); // Importar o modelo de usuário

const bcrypt = require('bcryptjs');

// Controlador para adicionar um novo usuário
exports.adicionarUsuario = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        // Verificar se o usuário já existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).send('Usuário já existe.');
        }

        // Criptografar a senha
        const hashedSenha = await bcrypt.hash(senha, 10);

        // Criar um novo usuário
        await Usuario.create({ nome, email, senha: hashedSenha });

        res.status(201).send('Usuário criado com sucesso.');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Outros controladores para atualizar e deletar usuários
