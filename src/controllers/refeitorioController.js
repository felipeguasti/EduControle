const Refeitorio = require('../models/refeitorio');
const path = require('path');
const fs = require('fs');
const sequelize = require('../config/db'); 
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
        const filtroProgramados = req.query.filtroProgramados === 'true';
        const filtroPublicados = req.query.filtroPublicados === 'true';
        const filtroExpirados = req.query.filtroExpirados === 'true';
        const filtroPainel = req.query.filtroPainel === 'true';
        
        let query = 'SELECT * FROM refeitorios';
        let replacements = {};

        if (filtroTurno) {
            query += ' WHERE turno = :turnoAtual OR turno = "ambos"';
            replacements = { turnoAtual };
        }

        if (filtroProgramados) {
            query += ' WHERE dataInicio > NOW()';
        }        
        
        if (filtroPublicados) {
            query += ' WHERE (dataInicio IS NULL OR dataInicio <= NOW()) AND (dataFim IS NULL OR dataFim >= NOW())';
        }      
        
        if (filtroExpirados) {
            query += ' WHERE dataFim < NOW()';
        }
        
        
        if (filtroPainel) {
            query += ' WHERE ((dataInicio IS NULL OR dataInicio <= NOW()) AND (dataFim IS NULL OR dataFim >= NOW())) AND (turno = :turnoAtual OR turno = "ambos")';
            replacements = { turnoAtual };
        }  

        const refeitorios = await sequelize.query(query, {
            replacements: replacements,
            type: sequelize.QueryTypes.SELECT 
        });
        res.send(refeitorios);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
};

exports.criarInformativo = async (req, res) => {
    console.log("Recebida requisição POST em '/api/refeitorio'");
    console.log("Corpo da requisição:", req.body);
    console.log("Arquivo da imagem:", req.file);

    const { titulo, mensagem, imagemUrl, videoUrl, videoComSom, turno, dataInicio, dataFim, dataPostagem } = req.body;
    const imagemFile = req.file;

    try {
        
        let dataExpiracao = null;
        let imagemFinalUrl = imagemUrl;

        let dataInicioAnuncio = dataInicio ? moment(dataInicio) : moment();
        if (dataInicioAnuncio.isBefore(moment(), 'day')) {
            dataInicioAnuncio = moment();
            return res.status(400).send({ error: "A data de início é anterior à data atual. Usando a data atual como data de início." });
        }

        if (dataFim) {
            const dataTerminoAnuncio = moment(dataFim);
            if (dataTerminoAnuncio.isBefore(dataInicioAnuncio, 'day')) {
                return res.status(400).send({ error: "A data de término não pode ser anterior à data de início do anúncio." });
            }
            dataExpiracao = dataTerminoAnuncio.endOf('day');
        }

        if (imagemFile) {
            imagemFinalUrl = req.protocol + '://' + req.get('host') + '/images/uploads/' + imagemFile.filename;
        }

        const novoInformativoData = {
            titulo,
            mensagem,
            imagemUrl: imagemFinalUrl,
            videoUrl,
            videoComSom,
            turno,
            dataInicio: dataInicioAnuncio.toDate(),
            dataFim: dataExpiracao,
            dataPostagem
        };

        if ((imagemFile || imagemUrl) && titulo && mensagem && turno && dataPostagem) {
            const novoInformativo = await Refeitorio.create(novoInformativoData);
            return res.status(201).send(novoInformativo);
        }        

        // Verificar se é apenas o envio da imagem ou o envio do formulário completo
        if (imagemFile && titulo && mensagem && turno && dataPostagem) {
            // Se for o envio do formulário completo, crie o informativo
            const novoInformativo = await Refeitorio.create(novoInformativoData);
            return res.status(201).send(novoInformativo);
        } else if (imagemFile) {
            // Se for apenas o envio da imagem, envie a URL da imagem
            return res.status(200).send({ imageUrl: imagemFinalUrl });
        } else {
            // Se nenhum dado for enviado, retorne um erro
            return res.status(400).send({ error: "Nenhum dado enviado para criar o informativo." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Erro ao criar o informativo. Por favor, tente novamente mais tarde." });
    }
};



exports.atualizarInformativo = async (req, res) => {
    const { titulo, mensagem, imagemUrl, videoUrl, videoComSom, turno, dataInicio, dataFim, dataPostagem } = req.body;
    const imagemFile = req.file;

    try {
        let dataExpiracao = null;

        let dataInicioAnuncio = dataInicio ? moment(dataInicio) : moment();

        if (dataFim && dataFim !== '') {
            const dataTerminoAnuncio = moment(dataFim);
            if (dataTerminoAnuncio.isValid() && !dataTerminoAnuncio.isBefore(dataInicioAnuncio, 'day')) {
                dataExpiracao = dataTerminoAnuncio.endOf('day').toDate();
            }
        }

        let imagemFinalUrl;
        if (imagemFile) {
            imagemFinalUrl = req.protocol + '://' + req.get('host') + '/images/uploads/' + imagemFile.filename;
        }

        await Refeitorio.update(
            { 
                titulo, 
                mensagem, 
                imagemUrl: imagemFinalUrl || imagemUrl,
                videoUrl, 
                videoComSom, 
                turno, 
                dataInicio: dataInicioAnuncio.toDate(), 
                dataFim: dataExpiracao,
                dataPostagem 
            },
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
        const imagePath = imageUrl ? path.join(__dirname, '..', 'public', 'images', 'uploads', path.basename(imageUrl)) : null;

        await Refeitorio.destroy({ where: { id: req.params.id } });

        if (imagePath && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log("Imagem excluída com sucesso:", imagePath);
        } else {
            console.log("Arquivo de imagem não encontrado ou caminho inválido:", imagePath);
        }

        res.send({ message: 'Informativo deletado com sucesso.' });
    } catch (error) {
        console.error("Erro ao deletar informativo:", error);
        res.status(500).send({ error: error.message });
    }
};

exports.renderAdminRefeitorio = (req, res) => {
    const onlyContent = req.query.section === 'content';
    res.render('adminRefeitorio', { onlyContent });
};

exports.buscarInformativoPorId = async (req, res) => {
    try {
        const informativo = await Refeitorio.findByPk(req.params.id);
        if (!informativo) {
            return res.status(404).send({ message: 'Informativo não encontrado.' });
        }
        res.json(informativo);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};