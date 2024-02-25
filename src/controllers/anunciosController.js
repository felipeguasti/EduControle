const Anuncio = require('../models/anuncio');
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
        const dadosAnuncio = {
            ...req.body,
            dataPublicacao: moment().tz('America/Sao_Paulo').toDate()
        };
        const novoAnuncio = await Anuncio.create(dadosAnuncio);
        res.redirect('admin');
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.obterAnuncioPorId = async (req, res) => {
    try {
        const anuncio = await Anuncio.findByPk(req.params.id);
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
        const anuncioAtualizado = await Anuncio.update(req.body, {
            where: { id: id },
            returning: true
        });
        if (!anuncioAtualizado[0]) {
            return res.status(404).send('Anúncio não encontrado');
        }

        res.json(anuncioAtualizado[1][0]);
    } catch (error) {
        res.status(500).send('Erro ao atualizar o anúncio: ' + error.message);
    }
};

exports.deletarAnuncio = async (req, res) => {
    try {
        const { id } = req.params;
        const anuncio = await Anuncio.destroy({
            where: { id: id }
        });

        if (!anuncio) {
            return res.status(404).send('Anúncio não encontrado');
        }

        res.send('Anúncio excluído com sucesso');
    } catch (error) {
        res.status(500).send('Erro ao deletar anúncio: ' + error.message);
    }
};

exports.listarAnunciosRecentes = async (req, res) => {
    try {
        const anunciosRecentes = await Anuncio.findAll({
            order: [['dataPublicacao', 'DESC']],
            limit: 10
        });
        res.json(anunciosRecentes);
    } catch (error) {
        console.error('Erro ao listar anúncios recentes:', error);
        res.status(500).json({ message: 'Erro ao listar anúncios recentes.' });
    }
};
