const { ObjectId } = require('mongodb');
const db = require('../config/db'); // Importação do arquivo db.js

async function getReservaModel() {
    const database = await db(); // Conecta ao banco de dados

    // Define a coleção de reservas
    const reservasCollection = database.collection('reservas');

    // Retorna o modelo de reserva
    return {
        async createReserva(recurso, data, turno, professor, turma, horario, observacoes) {
            const reserva = {
                recurso,
                data,
                turno,
                professor,
                turma,
                horario,
                observacoes,
            };
            const result = await reservasCollection.insertOne(reserva);
            return result.insertedId;
        },

        async getReservaById(reservaId) {
            return await reservasCollection.findOne({ _id: ObjectId(reservaId) });
        },

        async getAllReservas() {
            return await reservasCollection.find().toArray();
        },

        async updateReserva(reservaId, recurso, data, turno, professor, turma, horario, observacoes) {
            await reservasCollection.updateOne(
                { _id: ObjectId(reservaId) },
                { $set: { recurso, data, turno, professor, turma, horario, observacoes } }
            );
        },

        async deleteReserva(reservaId) {
            await reservasCollection.deleteOne({ _id: ObjectId(reservaId) });
        }
    };
}

module.exports = getReservaModel;
