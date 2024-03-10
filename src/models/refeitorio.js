const Sequelize = require('sequelize');
const db = require('../config/db');

// Definição do modelo 'Informativo'
const Refeitorio = db.define('refeitorio', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    mensagem: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    imagemUrl: {
        type: Sequelize.STRING,
        allowNull: true
    },
    imagemFile: {
        type: Sequelize.STRING,
        allowNull: true // No formulário, o campo é usado para upload de imagem
    },
    videoUrl: {
        type: Sequelize.STRING,
        allowNull: true
    },
    videoComSom: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    turno: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'matutino' // Valor padrão pode ser 'matutino' ou 'vespertino'
    },
    dataInicio: {
        type: Sequelize.DATE,
        allowNull: true
    },
    dataFim: {
        type: Sequelize.DATE,
        allowNull: true
    },
    dataPostagem: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW // Se não for fornecida, a data padrão será a data atual
    }
}, {
    timestamps: false
});

module.exports = Refeitorio;
