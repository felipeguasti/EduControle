const db = require('../config/db');

// Função para listar todos os recados
exports.listarRecados = async (req, res) => {
    try {
        const queryString = 'SELECT * FROM Recados';
        db.query(queryString, (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.json(result);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Função para criar um novo recado
exports.criarRecado = async (req, res) => {
    try {
        const { titulo, conteudo } = req.body;
        const queryString = 'INSERT INTO Recados (titulo, conteudo) VALUES (?, ?)';
        db.query(queryString, [titulo, conteudo], (err, result) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            res.status(201).json({ id: result.insertId, titulo: titulo, conteudo: conteudo });
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Função para buscar um recado por ID
exports.buscarRecadoPorId = async (req, res, next) => {
    const recadoId = req.params.id;
    try {
        const queryString = 'SELECT * FROM Recados WHERE id = ?';
        db.query(queryString, [recadoId], (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            if (result.length === 0) {
                return res.status(404).json({ message: 'Não consigo achar o recado' });
            }
            res.recado = result[0];
            next();
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Função para atualizar um recado por ID
exports.atualizarRecado = async (req, res) => {
    const recadoId = req.params.id;
    const { titulo, conteudo } = req.body;
    try {
        const queryString = 'UPDATE Recados SET titulo = ?, conteudo = ? WHERE id = ?';
        db.query(queryString, [titulo, conteudo, recadoId], (err, result) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Recado não encontrado' });
            }
            res.json({ message: 'Recado atualizado com sucesso' });
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Função para deletar um recado por ID
exports.deletarRecado = async (req, res) => {
    const recadoId = req.params.id;
    try {
        const queryString = 'DELETE FROM Recados WHERE id = ?';
        db.query(queryString, [recadoId], (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Recado não encontrado' });
            }
            res.json({ message: 'Recado excluído com sucesso' });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
