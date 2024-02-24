const Recado = require('../models/Recado');

// Função para listar todos os recados
exports.listarRecados = async (req, res) => {
    try {
        const recados = await Recado.findAll();
        res.json(recados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Função para criar um novo recado
exports.criarRecado = async (req, res) => {
    try {
        const { titulo, conteudo } = req.body;
        const recado = await Recado.create({ titulo, conteudo });
        res.status(201).json(recado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Função para buscar um recado por ID
exports.buscarRecadoPorId = async (req, res, next) => {
    const recadoId = req.params.id;
    try {
        const recado = await Recado.findByPk(recadoId);
        if (!recado) {
            return res.status(404).json({ message: 'Recado não encontrado' });
        }
        res.recado = recado;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Função para atualizar um recado por ID
exports.atualizarRecado = async (req, res) => {
    const recadoId = req.params.id;
    const { titulo, conteudo } = req.body;
    try {
        const recado = await Recado.findByPk(recadoId);
        if (!recado) {
            return res.status(404).json({ message: 'Recado não encontrado' });
        }
        await recado.update({ titulo, conteudo });
        res.json({ message: 'Recado atualizado com sucesso' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Função para deletar um recado por ID
exports.deletarRecado = async (req, res) => {
    const recadoId = req.params.id;
    try {
        const recado = await Recado.findByPk(recadoId);
        if (!recado) {
            return res.status(404).json({ message: 'Recado não encontrado' });
        }
        await recado.destroy();
        res.json({ message: 'Recado excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
