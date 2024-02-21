const { ObjectId } = require('mongodb');
const db = require('../config/db'); // Importação do arquivo db.js
const validator = require('validator'); // Importação da biblioteca validator

async function getRecadoModel() {
    const database = await db(); // Conecta ao banco de dados

    // Define a coleção de recados
    const recadosCollection = database.collection('recados');

    // Retorna o modelo do recado
    return {
        async createRecado(data, titulo, conteudo, imagem, turno) {
            const recado = {
                data,
                titulo,
                conteudo,
                imagem,
                turno,
            };
            const result = await recadosCollection.insertOne(recado);
            return result.insertedId;
        },

        async getRecadoById(recadoId) {
            return await recadosCollection.findOne({ _id: ObjectId(recadoId) });
        },

        async getAllRecados() {
            return await recadosCollection.find().toArray();
        },

        async updateRecado(recadoId, data, titulo, conteudo, imagem, turno) {
            await recadosCollection.updateOne(
                { _id: ObjectId(recadoId) },
                { $set: { data, titulo, conteudo, imagem, turno } }
            );
        },

        async deleteRecado(recadoId) {
            await recadosCollection.deleteOne({ _id: ObjectId(recadoId) });
        },

        validateURL(url) {
            // Valida se a URL é válida usando a biblioteca validator
            return url == null || validator.isURL(url);
        }
    };
}

module.exports = getRecadoModel;
