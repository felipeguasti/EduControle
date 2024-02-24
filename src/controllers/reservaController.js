const db = require('../config/db');

const ReservaController = {
    listarReservas(req, res) {
        try {
            const queryString = 'SELECT * FROM Reservas';
            db.query(queryString, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }
                res.json(result);
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    criarReserva(req, res) {
        try {
            const { campo1, campo2 } = req.body; // ajuste para os campos da sua tabela Reservas
            const queryString = 'INSERT INTO Reservas (campo1, campo2) VALUES (?, ?)';
            db.query(queryString, [campo1, campo2], (err, result) => {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }
                res.status(201).json({ id: result.insertId, campo1: campo1, campo2: campo2 });
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    buscarReservaPorId(req, res) {
        const reservaId = req.params.id;
        try {
            const queryString = 'SELECT * FROM Reservas WHERE id = ?';
            db.query(queryString, [reservaId], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }
                if (result.length === 0) {
                    return res.status(404).json({ message: 'Reserva não encontrada' });
                }
                res.json(result[0]);
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async atualizarReserva(req, res) {
        const reservaId = req.params.id;
        const { campo1, campo2 } = req.body; // ajuste para os campos da sua tabela Reservas
        try {
            const queryString = 'UPDATE Reservas SET campo1 = ?, campo2 = ? WHERE id = ?';
            db.query(queryString, [campo1, campo2, reservaId], (err, result) => {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Reserva não encontrada' });
                }
                res.json({ message: 'Reserva atualizada com sucesso' });
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async deletarReserva(req, res) {
        const reservaId = req.params.id;
        try {
            const queryString = 'DELETE FROM Reservas WHERE id = ?';
            db.query(queryString, [reservaId], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Reserva não encontrada' });
                }
                res.json({ message: 'Reserva excluída com sucesso' });
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = ReservaController;
