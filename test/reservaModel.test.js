
const mongoose = require('mongoose');
const Reserva = require('../models/reserva');

describe('Modelo Reserva', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('deve criar e salvar uma reserva com sucesso', async () => {
        const reservaData = { data: new Date(), turno: 'Matutino', professor: 'Prof. Teste', turma: '3A' };
        const reservaValida = new Reserva(reservaData);
        const reservaSalva = await reservaValida.save();

        expect(reservaSalva._id).toBeDefined();
        expect(reservaSalva.data).toBe(reservaData.data);
        expect(reservaSalva.turno).toBe(reservaData.turno);
        expect(reservaSalva.professor).toBe(reservaData.professor);
        expect(reservaSalva.turma).toBe(reservaData.turma);
    });
});
