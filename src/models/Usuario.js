const db = require('../config/db');

const usuarioSchema = `
    CREATE TABLE Usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        funcao ENUM('administrador', 'usuario') DEFAULT 'usuario'
    )
`;

db.query(usuarioSchema, (err, result) => {
    if (err) {
        console.error('Erro ao criar tabela Usuarios:', err);
    } else {
        console.log('Tabela Usuarios criada com sucesso!');
    }
});

module.exports = usuarioSchema;
