const Reserva = require('../models/reserva'); // Certifique-se de que este é o modelo Sequelize

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
            const novaReserva = await Reserva.create(req.body);
            res.status(201).json(novaReserva);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async buscarReservaPorId(req, res) {
        try {
            const reserva = await Reserva.findByPk(req.params.id);
            if (!reserva) {
                return res.status(404).json({ message: 'Reserva não encontrada' });
            }
            res.json(reserva);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async atualizarReserva(req, res) {
        try {
            const reserva = await Reserva.findByPk(req.params.id);
            if (!reserva) {
                return res.status(404).json({ message: 'Reserva não encontrada' });
            }
            await reserva.update(req.body);
            res.json(reserva);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async deletarReserva(req, res) {
        try {
            const reserva = await Reserva.findByPk(req.params.id);
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
