const Reserva = require('../models/reserva');

const ReservaController = {
    async listarReservas(req, res) {
        try {
            const reservas = await Reserva.find();
            res.json(reservas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async criarReserva(req, res) {
        try {
            const novaReserva = new Reserva(req.body);
            const reservaSalva = await novaReserva.save();
            res.status(201).json(reservaSalva);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async buscarReservaPorId(req, res) {
        try {
            const reserva = await Reserva.findById(req.params.id);
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
            const reservaAtualizada = await Reserva.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!reservaAtualizada) {
                return res.status(404).json({ message: 'Reserva não encontrada' });
            }
            res.json(reservaAtualizada);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async deletarReserva(req, res) {
        try {
            const reservaDeletada = await Reserva.findByIdAndDelete(req.params.id);
            if (!reservaDeletada) {
                return res.status(404).json({ message: 'Reserva não encontrada' });
            }
            res.json({ message: 'Reserva excluída com sucesso' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = ReservaController;
