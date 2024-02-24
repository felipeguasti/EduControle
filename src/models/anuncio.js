const db = require('../config/db');

const anuncioSchema = `
    CREATE TABLE Anuncios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tituloAnuncio VARCHAR(255),
        conteudoAnuncio TEXT,
        dataPublicacao DATETIME
    )
`;

db.query(anuncioSchema, (err, result) => {
    if (err) {
        console.error('Erro ao criar tabela Anuncios:', err);
    } else {
        console.log('Tabela Anuncios criada com sucesso!');
    }
});

module.exports = anuncioSchema;
