import request from "supertest";
import{ describe, it, expect} from 'vitest';
import app from '../app.js';

describe('POST /api/login', () => {
    it('recusa vazio', async () => {
        const r = await request(app).post('/api/login').send({});
        expect(r.status).toBe(400);
    });

    it('recusa quando falta senha', async () => {
        const r = await request(app).post('/api/login').send({usuario: 'admin'});
        expect(r.status).toBe(400);
    });
})