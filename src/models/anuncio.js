const { ObjectId } = require('mongodb');
const db = require('../config/db'); // Importação do arquivo db.js

async function getAnuncioModel() {
    const database = await db(); // Conecta ao banco de dados

    // Define a coleção de anúncios
    const anunciosCollection = database.collection('anuncios');

    // Retorna o modelo do anúncio
    return {
        async createAnuncio(tituloAnuncio, conteudoAnuncio, dataPublicacao) {
            const result = await anunciosCollection.insertOne({
                tituloAnuncio,
                conteudoAnuncio,
                dataPublicacao,
            });
            return result.insertedId;
        },

        async getAnuncioById(anuncioId) {
            return await anunciosCollection.findOne({ _id: ObjectId(anuncioId) });
        },

        async getAllAnuncios() {
            return await anunciosCollection.find().toArray();
        },

        async updateAnuncio(anuncioId, tituloAnuncio, conteudoAnuncio, dataPublicacao) {
            await anunciosCollection.updateOne(
                { _id: ObjectId(anuncioId) },
                { $set: { tituloAnuncio, conteudoAnuncio, dataPublicacao } }
            );
        },

        async deleteAnuncio(anuncioId) {
            await anunciosCollection.deleteOne({ _id: ObjectId(anuncioId) });
        }
    };
}

module.exports = getAnuncioModel;
