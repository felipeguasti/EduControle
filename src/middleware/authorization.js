// Removendo a função authorize
// function authorize(roles = []) {
//     // roles param can be a single role string (e.g. 'administrador') 
//     // or an array of roles (e.g. ['administrador', 'usuario'])
//     if (typeof roles === 'string') {
//         roles = [roles];
//     }

//     return (req, res, next) => {
//         if (!req.session.usuarioId) {
//             // O usuário não está logado
//             return res.status(401).send('Usuário não autenticado. Por favor, faça login.');
//         }

//         if (roles.includes(req.session.role)) {
//             next();  // Role is allowed, so continue
//         } else {
//             // Log da tentativa de acesso não autorizado
//             console.error(`Tentativa de acesso não autorizado por usuário com ID: ${req.session.usuarioId} e papel: ${req.session.role}`);

//             res.status(403).send('Acesso negado. Permissões insuficientes.');
//         }
//     };
// }

// module.exports = authorize;
