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
            where: { id: id }
        });
        if (!anuncioAtualizado[0]) {
            return res.status(404).send('Anúncio não encontrado');
        }

        res.json(anuncioAtualizado); // Aqui, apenas retornamos o resultado da atualização
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
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = 8;
        const offset = (pagina - 1) * limite;

        const anunciosRecentes = await Anuncio.findAll({
            order: [['dataPublicacao', 'DESC']],
            limit: limite,
            offset: offset
        });

        res.json(anunciosRecentes);
    } catch (error) {
        console.error('Erro ao listar anúncios recentes:', error);
        res.status(500).json({ message: 'Erro ao listar anúncios recentes.' });
    }
};


exports.contarTotalAnuncios = async (req, res) => {
    try {
        console.log("Requisição recebida para contar total de anúncios");
        const anuncios = await Anuncio.findAll();
        console.log("Anúncios encontrados:", anuncios); // Adicione este log para verificar se a consulta está retornando resultados
        const total = anuncios.length;
        console.log("Total de anúncios:", total);
        res.json({ total });
    } catch (error) {
        console.error("Erro ao buscar anúncios:", error);
        res.status(500).send({ message: "Erro ao buscar anúncios" });
    }
};

exports.renderAdminAnuncios = async (req, res) => {
    try {
        const anuncios = await Anuncio.findAll({
            order: [['dataPublicacao', 'DESC']]
        });
        const onlyContent = req.query.section === 'content';
        res.render('anuncios', { anuncios, onlyContent });
    } catch (error) {
        console.error('Erro ao renderizar página de administração de anúncios:', error);
        res.status(500).send('Erro ao renderizar página de administração de anúncios');
    }
};





