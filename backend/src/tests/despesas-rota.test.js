import request from 'supertest';
import { describe, it, expect } from "vitest";
import app from '../app.js';

describe('POST /app/projetos/:id/despesas', () => {
    it('recusa despesa sem descricao', async () => {
        const r = await request(app)
            .post('/api/projetos/1/despesas')
            .send({ valor:10, data: '2026-11-18'});
        
        expect(r.status).toBe(400);
        expect(r.body.erros).toHaveProperty('descricao');
    });
    
    it('recusa despesa com valor 0', async () => {
        const r = await request(app)
            .post('/api/projetos/1/despesas')
            .send({ descricao: 'frete', valor:0, data: '2026-11-18'});
        
        expect(r.status).toBe(400);
        expect(r.body.erros).toHaveProperty('valor');
    });
})