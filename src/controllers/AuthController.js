const { Usuario } = require('../models'); // Importar o modelo de usuário
const bcrypt = require('bcryptjs');

// Controlador para login do usuário
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        // Buscar o usuário pelo email no banco de dados
        const usuario = await Usuario.findOne({ where: { email } });

        // Verificar se o usuário existe
        if (!usuario) {
            return res.status(401).send('Credenciais inválidas.');
        }

        // Verificar se a senha está correta
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
