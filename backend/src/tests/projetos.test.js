import request from 'supertest';
import { it, expect } from 'vitest';
import app from '../app.js';

it('POST /api/projetos recusa projeto sem descrição', async () => {
    const r = (await request(app).post('/api/projetos').send({ cliente_id: 1, valor_fechado: 1000 }));
    expect(r.status).toBe(400);
    expect(r.body.erros).toHaveProperty('descricao');
});