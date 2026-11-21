import { describe, it, expect, beforeAll } from 'vitest';
import jwt from 'jsonwebtoken';
import {gerarToken, verificarToken} from '../auth.js';

beforeAll(() => {
    process.env.JWT_SECRET = 'segredo-teste';
});

describe('token de login', () => {
    it('token valido devolve os dados do usuario', () => {
        const token = gerarToken({id: 1, usuario: 'admin'});
        const dados = verificarToken(token);
        expect(dados.usuario).toBe('admin');
    });

    it('recusa um texto qualquer', () => {
        expect(() => verificarToken('texto-qualquer-que-nao-eh-token')).toThrow();
    });

    it('recusa token com outro segredo', () => {
        const falso = jwt.sign({usuario: 'admin'}, 'segredo-falso');
        expect(() => verificarToken(falso)).toThrow();
    });

    it('recusa um token expirado', () => {
        const vencido = jwt.sign({usuario: 'admin'}, 'segredo-teste', {expiresIn: -10});
        expect(() => verificarToken(vencido)).toThrow();
    });
});