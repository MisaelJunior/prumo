import request from 'supertest';
import { describe, it, expect, beforeAll } from "vitest";
import app from '../app.js';
import { gerarToken } from '../auth.js';

beforeAll(() => {
    process.env.JWT_SECRET = 'segredo-teste';
});

describe('POST /app/projetos/:id/despesas', () => {
    it('recusa despesa sem descricao', async () => {
        const token = gerarToken({id: 1, usuario: 'admin'});
        const r = await request(app)
            .post('/api/projetos/1/despesas')
            .set('Authorization', `Bearer ${token}`)
            .send({ valor:10, data: '2026-11-18'});
        
        expect(r.status).toBe(400);
        expect(r.body.erros).toHaveProperty('descricao');
    });
    
    it('recusa despesa com valor 0', async () => {
        const token = gerarToken({id: 1, usuario: 'admin'});
        const r = await request(app)
            .post('/api/projetos/1/despesas')
            .set('Authorization', `Bearer ${token}`)
            .send({ descricao: 'frete', valor:0, data: '2026-11-18'});
        
        expect(r.status).toBe(400);
        expect(r.body.erros).toHaveProperty('valor');
    });
})