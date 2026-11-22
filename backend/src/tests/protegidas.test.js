import request from "supertest";
import {describe, it, expect} from 'vitest';
import app from '../app.js';

const rotas = [
  ['get', '/api/projetos'],
  ['post', '/api/projetos'],
  ['get', '/api/clientes'],
  ['post', '/api/clientes'],
  ['get', '/api/projetos/1/parcelas'],
  ['post', '/api/parcelas/1/baixa'],
];

describe('rotas protegidas', () =>{
    it.each(rotas)('%s %s sem token devolve 401', async (metodo, caminho) => {
        const r = await request(app)[metodo](caminho);
        expect(r.status).toBe(401);
    });

    it('a rota de saude continua publica', async () => {
        const r = await request(app).get('/api/saude');
        expect(r.status).toBe(200);
    });
});