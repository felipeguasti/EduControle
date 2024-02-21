
const request = require('supertest');
const app = require('../../app');

describe('Rotas de Reservas', () => {
    describe('GET /api/reservas', () => {
        it('deve retornar um array de reservas', async () => {
            const res = await request(app).get('/api/reservas');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
        });
    });
});
