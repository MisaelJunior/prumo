import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
import app from '../app.js';
import { gerarToken } from '../auth.js';

let token;

beforeAll(() => {
    process.env.JWT_SECRET = 'segredo-teste';
    token = gerarToken({ id: 1, usuario: 'admin' });
});

describe('contas a pagar: exige login', () => {
    it('GET /api/despesas sem token devolve 401', async () => {
        const r = await request(app).get('/api/despesas');
        expect(r.status).toBe(401);
    });
    it('POST /api/despesas sem token devolve 401', async () => {
        const r = await request(app).post('/api/despesas').send({});
        expect(r.status).toBe(401);
    });
    it('PATCH /api/despesas sem token devolve 401', async () => {
        const r = await request(app).patch('/api/despesas/1/pagar');
        expect(r.status).toBe(401);
    });
});

describe('POST /api/despesas (despesa fixa): validação', () => {
    const enviar = (corpo) =>
        request(app).post('/api/despesas').set('Authorization', `Bearer ${token}`).send(corpo);

    it('recusa despesa sem descricao', async () => {
        const r = await enviar({ valor: 1800, vencimento:'2026-12-05'});
        expect(r.status).toBe(400);
        expect(r.body.erros).toHaveProperty('descricao')
    });
    it('recusa despesa sem vencimento', async () => {
        const r = await enviar({ descricao: 'Aluguel', valor:1800});
        expect(r.status).toBe(400);
        expect(r.body.erros).toHaveProperty('vencimento')
    });
    it('recusa repetição acima de 60 meses', async () => {
        const r = await enviar({ descricao: 'Aluguel', valor: 1800, vencimento: '2026-12-05', repetir_meses: 61 });
        expect(r.status).toBe(400);
        expect(r.body.erros).toHaveProperty('repetir_meses');
    });
});

describe('PATCH /api/despesas/:id/pagar', () => {
    it('id que não é número devolve 404 com mensagem', async () => {
        const r = await request(app).patch('/api/despesas/abc/pagar').set('Authorization', `Bearer ${token}`);
        expect(r.status).toBe(404);
        expect(r.body.erro).toBe('Despesa não encontrada');
    });
});