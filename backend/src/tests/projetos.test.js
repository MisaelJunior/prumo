import request from 'supertest';
import { it, expect, beforeAll } from 'vitest';
import app from '../app.js';
import { gerarToken } from '../auth.js';

beforeAll(() => {
    process.env.JWT_SECRET = 'segredo-teste';
});

it('POST /api/projetos recusa projeto sem descrição', async () => {
    const token = gerarToken({id: 1, usuario: 'admin'});
    const r = await request(app).post('/api/projetos').set('Authorization', `Bearer ${token}`).send({ cliente_id: 1, valor_fechado: 1000 });
    expect(r.status).toBe(400);
    expect(r.body.erros).toHaveProperty('descricao');
});