const db = require('../config/db');

const reservaSchema = `
    CREATE TABLE Reservas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        recurso VARCHAR(255) NOT NULL,
        data DATE NOT NULL,
        turno ENUM('Matutino', 'Vespertino') NOT NULL,
        professor VARCHAR(255) NOT NULL,
        turma VARCHAR(255) NOT NULL,
        horario VARCHAR(20) NOT NULL,
        observacoes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_recurso FOREIGN KEY (recurso) REFERENCES Recursos(nome)
    )
`;

db.query(reservaSchema, (err, result) => {
    if (err) {
        console.error('Erro ao criar tabela Reservas:', err);
    } else {
        console.log('Tabela Reservas criada com sucesso!');
    }
});

module.exports = reservaSchema;
