const { ObjectId } = require('mongodb');
const db = require('../config/db'); // Importação do arquivo db.js
const moment = require('moment-timezone');

exports.listarAnuncios = async (req, res) => {
    try {
        const database = await db(); // Conecta ao banco de dados
        const anunciosCollection = database.collection('anuncios');
        const anuncios = await anunciosCollection.find().toArray();
        res.render('admin', { anuncios });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.mostrarAnuncios = async (req, res) => {
    try {
        const database = await db(); // Conecta ao banco de dados
        const anunciosCollection = database.collection('anuncios');
        const anuncios = await anunciosCollection.find().toArray();
        res.json(anuncios);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.criarAnuncios = async (req, res) => {
    try {
        const { tituloAnuncio, conteudoAnuncio } = req.body;
        const database = await db(); // Conecta ao banco de dados
        const anunciosCollection = database.collection('anuncios');

        // Adicionar a data e hora de Brasília
        const dataPublicacao = moment().tz('America/Sao_Paulo').toDate();

        // Criar um novo objeto de anúncio
        const novoAnuncio = {
            tituloAnuncio,
            conteudoAnuncio,
            dataPublicacao
        };

        // Salvar o anúncio no banco de dados
        await anunciosCollection.insertOne(novoAnuncio);

        res.redirect('admin');
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.obterAnuncioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const database = await db(); // Conecta ao banco de dados
        const anunciosCollection = database.collection('anuncios');
        const anuncio = await anunciosCollection.findOne({ _id: ObjectId(id) });

        if (!anuncio) {
            return res.status(404).send('Anúncio não encontrado');
        }

        res.json(anuncio);
    } catch (error) {
        res.status(500).send('Erro ao buscar o anúncio: ' + error.message);
    }
};

exports.atualizarAnuncio = async (req, res) => {
    try {
        const { id } = req.params;
        const database = await db(); // Conecta ao banco de dados
        const anunciosCollection = database.collection('anuncios');
        const anuncioAtualizado = await anunciosCollection.findOneAndUpdate(
            { _id: ObjectId(id) },
            { $set: req.body },
            { returnOriginal: false }
        );

        if (!anuncioAtualizado.value) {
            return res.status(404).send('Anúncio não encontrado');
        }

        res.json(anuncioAtualizado.value);
    } catch (error) {
        res.status(500).send('Erro ao atualizar o anúncio: ' + error.message);
    }
};

exports.deletarAnuncio = async (req, res) => {
    try {
        const { id } = req.params;
        const database = await db(); // Conecta ao banco de dados
        const anunciosCollection = database.collection('anuncios');
        const result = await anunciosCollection.deleteOne({ _id: ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).send('Anúncio não encontrado');
        }

        res.send('Anúncio excluído com sucesso');
    } catch (error) {
        res.status(500).send('Erro ao deletar anúncio: ' + error.message);
    }
};

exports.listarAnunciosRecentes = async (req, res) => {
    try {
        const database = await db(); // Conecta ao banco de dados
        const anunciosCollection = database.collection('anuncios');
        const anunciosRecentes = await anunciosCollection.find().sort({ dataPublicacao: -1 }).limit(10).toArray();
        res.json(anunciosRecentes);
    } catch (error) {
        console.error('Erro ao listar anúncios recentes:', error);
        res.status(500).send({ message: error.message });
    }
};
