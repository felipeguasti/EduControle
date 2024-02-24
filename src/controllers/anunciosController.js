const Anuncio = require('../models/Anuncio');
const moment = require('moment-timezone');

exports.listarAnuncios = async (req, res) => {
    try {
        const anuncios = await Anuncio.findAll();
        res.render('admin', { anuncios });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.mostrarAnuncios = async (req, res) => {
    try {
        const anuncios = await Anuncio.findAll();
        res.json(anuncios);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.criarAnuncios = async (req, res) => {
    try {
        const { titulo, descricao } = req.body;
        const dataPublicacao = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
        await Anuncio.create({ titulo, descricao, dataPublicacao });
        res.redirect('admin');
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.obterAnuncioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const anuncio = await Anuncio.findByPk(id);
        if (!anuncio) {
            return res.status(404).send('Anúncio não encontrado');
        }
        res.json(anuncio);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.atualizarAnuncio = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao } = req.body;
        const anuncio = await Anuncio.findByPk(id);
        if (!anuncio) {
            return res.status(404).send('Anúncio não encontrado');
        }
        await anuncio.update({ titulo, descricao });
        res.json({ message: 'Anúncio atualizado com sucesso' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.deletarAnuncio = async (req, res) => {
    try {
        const { id } = req.params;
        const anuncio = await Anuncio.findByPk(id);
        if (!anuncio) {
            return res.status(404).send('Anúncio não encontrado');
        }
        await anuncio.destroy();
        res.json({ message: 'Anúncio excluído com sucesso' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.listarAnunciosRecentes = async (req, res) => {
    try {
        const anuncios = await Anuncio.findAll({
            order: [['dataPublicacao', 'DESC']],
            limit: 10
        });
        res.json(anuncios);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
