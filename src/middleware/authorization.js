const db = require('../config/db'); // Importação do arquivo db.js

async function authorize(roles = []) {
    // roles param can be a single role string (e.g. 'administrador') 
    // or an array of roles (e.g. ['administrador', 'usuario'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    const database = await db(); // Conecta ao banco de dados

    return async (req, res, next) => {
        if (!req.session.usuarioId) {
            // O usuário não está logado
            return res.status(401).send('Usuário não autenticado. Por favor, faça login.');
        }

        const usuariosCollection = database.collection('usuarios');
        const usuario = await usuariosCollection.findOne({ _id: ObjectId(req.session.usuarioId) });

        if (!usuario) {
            // O usuário não existe ou não foi encontrado
            return res.status(401).send('Usuário não autenticado. Por favor, faça login.');
        }

        if (roles.includes(usuario.funcao)) {
            next();  // Role is allowed, so continue
        } else {
            // Log da tentativa de acesso não autorizado
            console.error(`Tentativa de acesso não autorizado por usuário com ID: ${req.session.usuarioId} e papel: ${usuario.funcao}`);

            res.status(403).send('Acesso negado. Permissões insuficientes.');
        }
    };
}

module.exports = authorize;
