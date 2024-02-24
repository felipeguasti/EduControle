const db = require('../config/db');

const recadoSchema = `
    CREATE TABLE Recados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        data DATE NOT NULL,
        titulo VARCHAR(100) NOT NULL,
        conteudo VARCHAR(280) NOT NULL,
        imagem VARCHAR(255), -- Altere o tamanho conforme necessário
        turno ENUM('Matutino', 'Vespertino', 'Integral') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
`;

db.query(recadoSchema, (err, result) => {
    if (err) {
        console.error('Erro ao criar tabela Recados:', err);
    } else {
        console.log('Tabela Recados criada com sucesso!');
    }
});

module.exports = recadoSchema;
