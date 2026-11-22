import request from "supertest";
import express from 'express';
import { describe, it, expect, beforeAll } from 'vitest';
import { gerarToken } from "../auth";
import { exigirLogin } from '../exigirLogin.js';

beforeAll(() => {
    process.env.JWT_SECRET = 'segredo-teste'
});

function criarApp(){
    const app = express();
    app.get('/protegida', exigirLogin, (req, res) =>{
        res.json({usuario: req.usuario.usuario});
    });
    return app;
}

describe('exigirLogin', () => {
    it('recusa a req sem token', async () => {
        const r = await request(criarApp()).get('/protegida');
        expect(r.status).toBe(401);
    });

    it('recusa token invalido', async () => {
        const r = await request(criarApp()).get('/protegida').set('Authorization', 'Bearer falso');
        expect(r.status).toBe(401);
    });

    it('recusa cabecalho sem a palavra Bearer', async () => {
        const token = gerarToken({ id: 1, usuario: 'admin'});
        const r = await request(criarApp()).get('/protegida').set('Authorization', token);
        expect(r.status).toBe(401);
    });

    it('deixa passar com token valido e enrtega o usuario', async () => {
        const token = gerarToken({ id: 1, usuario: 'admin' });
        const r = await request(criarApp()).get('/protegida').set('Authorization', `Bearer ${token}`);
        expect(r.status).toBe(200);
        expect(r.body.usuario).toBe('admin');
    });
});