const Anuncio = require('../models/anuncio');
const moment = require('moment-timezone');


exports.listarAnuncios = async (req, res) => {
    try {
        const anuncios = await Anuncio.find();
        res.render('admin', { anuncios });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.mostrarAnuncios = async (req, res) => {
    try {
        const anuncios = await Anuncio.find();
        res.json(anuncios);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.criarAnuncios = async (req, res) => {
    try {
        // Criar um novo objeto de anúncio
        const novoAnuncio = new Anuncio(req.body);

        // Adicionar a data e hora de Brasília
        novoAnuncio.dataPublicacao = moment().tz('America/Sao_Paulo').toDate();

        // Salvar o anúncio no banco de dados
        await novoAnuncio.save();

        res.redirect('admin');
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.obterAnuncioPorId = async (req, res) => {
    try {
        const anuncio = await Anuncio.findById(req.params.id);
        if (!anuncio) {
            return res.status(404).send('Anúncio não encontrado');
        }
        res.json(anuncio);
    } catch (error) {
        res.status(500).send('Erro ao buscar o anúncio: ' + error.message);
    }
};

// Método para atualizar um anúncio
exports.atualizarAnuncio = async (req, res) => {
    try {
        const { id } = req.params;
        const anuncioAtualizado = await Anuncio.findByIdAndUpdate(id, req.body, { new: true });

        if (!anuncioAtualizado) {
            return res.status(404).send('Anúncio não encontrado');
        }

        res.json(anuncioAtualizado);
    } catch (error) {
        res.status(500).send('Erro ao atualizar o anúncio: ' + error.message);
    }
};

exports.deletarAnuncio = async (req, res) => {
    try {
        const { id } = req.params;
        const anuncio = await Anuncio.findByIdAndRemove(id);

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
        const anunciosRecentes = await Anuncio.find().sort({ dataPublicacao: -1 }).limit(10);
        res.json(anunciosRecentes);
    } catch (error) {
        console.error('Erro ao listar anúncios recentes:', error);
        res.status(500).json({ message: 'Erro ao listar anúncios recentes.' });
    }
};
