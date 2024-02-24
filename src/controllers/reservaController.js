const Reserva = require('../models/Reserva');

const ReservaController = {
    async listarReservas(req, res) {
        try {
            const reservas = await Reserva.findAll();
            res.json(reservas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async criarReserva(req, res) {
        try {
            const { campo1, campo2 } = req.body; // ajuste para os campos da sua tabela Reservas
            const reserva = await Reserva.create({ campo1, campo2 });
            res.status(201).json(reserva);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async buscarReservaPorId(req, res) {
        const reservaId = req.params.id;
        try {
            const reserva = await Reserva.findByPk(reservaId);
            if (!reserva) {
                return res.status(404).json({ message: 'Reserva não encontrada' });
            }
            res.json(reserva);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async atualizarReserva(req, res) {
        const reservaId = req.params.id;
        const { campo1, campo2 } = req.body; // ajuste para os campos da sua tabela Reservas
        try {
            const reserva = await Reserva.findByPk(reservaId);
            if (!reserva) {
                return res.status(404).json({ message: 'Reserva não encontrada' });
            }
            await reserva.update({ campo1, campo2 });
            res.json({ message: 'Reserva atualizada com sucesso' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async deletarReserva(req, res) {
        const reservaId = req.params.id;
        try {
            const reserva = await Reserva.findByPk(reservaId);
            if (!reserva) {
                return res.status(404).json({ message: 'Reserva não encontrada' });
            }
            await reserva.destroy();
            res.json({ message: 'Reserva excluída com sucesso' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = ReservaController;
