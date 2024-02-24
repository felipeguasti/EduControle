const db = require('../config/db');
const moment = require('moment-timezone');

exports.listarAnuncios = async (req, res) => {
    try {
        const queryString = 'SELECT * FROM Anuncio';
        db.query(queryString, (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.render('admin', { anuncios: result });
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.mostrarAnuncios = async (req, res) => {
    try {
        const queryString = 'SELECT * FROM Anuncio';
        db.query(queryString, (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.json(result);
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.criarAnuncios = async (req, res) => {
    try {
        const { titulo, descricao } = req.body;
        const dataPublicacao = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
        const insertString = 'INSERT INTO Anuncio (titulo, descricao, dataPublicacao) VALUES (?, ?, ?)';
        db.query(insertString, [titulo, descricao, dataPublicacao], (insertErr, insertResult) => {
            if (insertErr) {
                return res.status(500).send(insertErr.message);
            }
            res.redirect('admin');
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.obterAnuncioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const queryString = 'SELECT * FROM Anuncio WHERE id = ?';
        db.query(queryString, [id], (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (result.length === 0) {
                return res.status(404).send('Anúncio não encontrado');
            }
            res.json(result[0]);
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Método para atualizar um anúncio
exports.atualizarAnuncio = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao } = req.body;
        const queryString = 'UPDATE Anuncio SET titulo = ?, descricao = ? WHERE id = ?';
        db.query(queryString, [titulo, descricao, id], (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (result.affectedRows === 0) {
                return res.status(404).send('Anúncio não encontrado');
            }
            res.json({ message: 'Anúncio atualizado com sucesso' });
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.deletarAnuncio = async (req, res) => {
    try {
        const { id } = req.params;
        const queryString = 'DELETE FROM Anuncio WHERE id = ?';
        db.query(queryString, [id], (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (result.affectedRows === 0) {
                return res.status(404).send('Anúncio não encontrado');
            }
            res.json({ message: 'Anúncio excluído com sucesso' });
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.listarAnunciosRecentes = async (req, res) => {
    try {
        const queryString = 'SELECT * FROM Anuncio ORDER BY dataPublicacao DESC LIMIT 10';
        db.query(queryString, (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.json(result);
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
