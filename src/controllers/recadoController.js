const Recado = require('../models/recado');

exports.listarRecados = async (req, res) => {
    try {
        const recados = await Recado.find();
        res.json(recados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.criarRecado = async (req, res) => {
    try {
        const novoRecado = new Recado(req.body);
        const recadoSalvo = await novoRecado.save();
        res.status(201).json(recadoSalvo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.buscarRecadoPorId = async (req, res, next) => {
    let recado;
    try {
        recado = await Recado.findById(req.params.id);
        if (recado == null) {
            return res.status(404).json({ message: 'Não consigo achar o recado' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.recado = recado;
    next();
};

exports.atualizarRecado = async (req, res) => {
    if (req.body.titulo != null) {
        res.recado.titulo = req.body.titulo;
    }
    if (req.body.conteudo != null) {
        res.recado.conteudo = req.body.conteudo;
    }
    try {
        const updatedRecado = await res.recado.save();
        res.json(updatedRecado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deletarRecado = async (req, res) => {
    try {
        await res.recado.remove();
        res.json({ message: 'Recado excluido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
