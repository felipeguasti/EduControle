const Recado = require('../models/recado'); // Certifique-se de que este é o modelo Sequelize

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
        const novoRecado = await Recado.create(req.body);
        res.status(201).json(novoRecado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Função para buscar um recado por ID
exports.buscarRecadoPorId = async (req, res) => {
    try {
        const recado = await Recado.findByPk(req.params.id);
        if (!recado) {
            return res.status(404).json({ message: 'Não consigo achar o recado' });
        }
        res.json(recado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Função para atualizar um recado por ID
exports.atualizarRecado = async (req, res) => {
    try {
        const recado = await Recado.findByPk(req.params.id);
        if (!recado) {
            return res.status(404).json({ message: 'Recado não encontrado' });
        }
        await recado.update(req.body);
        res.json(recado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Função para deletar um recado por ID
exports.deletarRecado = async (req, res) => {
    try {
        const recado = await Recado.findByPk(req.params.id);
        if (!recado) {
            return res.status(404).json({ message: 'Recado não encontrado' });
        }
        await recado.destroy();
        res.json({ message: 'Recado excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
