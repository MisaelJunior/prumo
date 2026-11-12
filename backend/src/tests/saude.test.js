import request from 'supertest';
import { it, expect } from 'vitest';
import app from '../app.js';

it('responde ok na rota de saúde', async () => {
  const r = await request(app).get('/api/saude');
  expect(r.status).toBe(200);
  expect(r.body.status).toBe('ok');
});