const { ObjectId } = require('mongodb');
const db = require('../config/db'); // Importação do arquivo db.js
const bcrypt = require('bcryptjs');

async function getUsuarioModel() {
    const database = await db(); // Conecta ao banco de dados

    // Define a coleção de usuários
    const usuariosCollection = database.collection('usuarios');

    // Retorna o modelo de usuário
    return {
        async createUsuario(nome, email, senha, funcao = 'usuario') {
            const usuario = {
                nome,
                email,
                senha: await bcrypt.hash(senha, 10), // Hash de senha antes de salvar
                funcao,
            };
            const result = await usuariosCollection.insertOne(usuario);
            return result.insertedId;
        },

        async getUsuarioByEmail(email) {
            return await usuariosCollection.findOne({ email });
        },

        async getUsuarioById(usuarioId) {
            return await usuariosCollection.findOne({ _id: ObjectId(usuarioId) });
        },

        async updateUsuario(usuarioId, nome, email, senha, funcao) {
            const usuario = {};
            if (nome) usuario.nome = nome;
            if (email) usuario.email = email;
            if (senha) usuario.senha = await bcrypt.hash(senha, 10); // Hash de senha antes de salvar
            if (funcao) usuario.funcao = funcao;

            await usuariosCollection.updateOne(
                { _id: ObjectId(usuarioId) },
                { $set: usuario }
            );
        },

        async deleteUsuario(usuarioId) {
            await usuariosCollection.deleteOne({ _id: ObjectId(usuarioId) });
        },

        async comparePassword(senha, hashedSenha) {
            return await bcrypt.compare(senha, hashedSenha);
        }
    };
}

module.exports = getUsuarioModel;
