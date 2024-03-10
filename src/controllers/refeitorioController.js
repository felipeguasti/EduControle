const Refeitorio = require('../models/refeitorio');
const path = require('path');
const fs = require('fs');
const sequelize = require('../config/db'); // Certifique-se de que sequelize está importado
const moment = require('moment');

const getTurnoAtual = () => {
    const now = new Date();
    const horaBrasilia = now.getUTCHours() - 3;
    return (horaBrasilia >= 0 && horaBrasilia < 12.5) ? 'matutino' : 'vespertino';
};


exports.listarInformativos = async (req, res) => {
    try {
        const turnoAtual = getTurnoAtual();
        const filtroTurno = req.query.filtroTurno === 'true';
        
        let query = 'SELECT * FROM refeitorios';
        let replacements = {};

        if (filtroTurno) {
            query += ' WHERE turno = :turnoAtual OR turno = "ambos"';
            replacements = { turnoAtual };
        }

        const refeitorios = await sequelize.query(query, {
            replacements: replacements,
            type: sequelize.QueryTypes.SELECT 
        });

        console.log(refeitorios); // Para verificar o que está sendo retornado
        res.send(refeitorios);
    } catch (error) {
        console.error(error); // Log de erros no servidor para diagnóstico
        res.status(500).send({ error: error.message });
    }
};

exports.criarInformativo = async (req, res) => {
    const { titulo, mensagem, imagemUrl, imagemFile, videoUrl, videoComSom, turno, dataInicio, dataFim, dataPostagem } = req.body;
    console.log(req.body);
    try {
        let dataExpiracao = null;

        // Verifica a data de início do anúncio
        let dataInicioAnuncio = dataInicio ? moment(dataInicio) : moment();
        if (dataInicioAnuncio.isBefore(moment(), 'day')) {
            dataInicioAnuncio = moment();
            return res.status(400).send({ error: "A data de início é anterior à data atual. Usando a data atual como data de início." });
        }

        // Verifica a data de término do anúncio
        if (dataFim) {
            const dataTerminoAnuncio = moment(dataFim);
            if (dataTerminoAnuncio.isBefore(dataInicioAnuncio, 'day')) {
                return res.status(400).send({ error: "A data de término não pode ser anterior à data de início do anúncio." });
            }
            dataExpiracao = dataTerminoAnuncio.endOf('day');
        }

        const novoInformativo = await Refeitorio.create({
            titulo,
            mensagem,
            imagemUrl,
            imagemFile,
            videoUrl,
            videoComSom,
            turno,
            dataInicio: dataInicioAnuncio.toDate(),
            dataFim: dataExpiracao ? dataExpiracao.toDate() : null,
            dataPostagem
        });
        res.status(201).send(novoInformativo);
    } catch (error) {
        res.status(500).send({ error: "Erro ao criar o informativo. Por favor, tente novamente mais tarde." });
    }
};


exports.atualizarInformativo = async (req, res) => {
    const { titulo, mensagem, imagemUrl, videoUrl, videoComSom, turno, dataPostagem } = req.body;
    try {
        await Refeitorio.update(
            { titulo, mensagem, imagemUrl, videoUrl, videoComSom, turno, dataPostagem },
            { where: { id: req.params.id } }
        );
        res.send({ message: 'Informativo atualizado com sucesso.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.deletarInformativo = async (req, res) => {
    try {
        const refeitorio = await Refeitorio.findByPk(req.params.id);
        if (!refeitorio) {
            return res.status(404).send({ message: 'Informativo não encontrado.' });
        }

        const imageUrl = refeitorio.imagemUrl;
        const imagePath = imageUrl ? path.join(__dirname, '..', '..', 'public', 'img', path.basename(imageUrl)) : null;

        await Refeitorio.destroy({ where: { id: req.params.id } });

        if (imagePath && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        res.send({ message: 'Informativo deletado com sucesso.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.renderAdminRefeitorio = (req, res) => {
    const onlyContent = req.query.section === 'content';
    res.render('adminRefeitorio', { onlyContent });
};

