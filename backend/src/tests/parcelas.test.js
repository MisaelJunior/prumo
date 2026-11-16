import {describe, it, expect} from 'vitest';
import { validarParcelas } from '../validacoes.js';

describe('validarParcelas', () => {
    const duas = [
        {valor: 2000, vencimento: '2026-11-20'},
        {valor: 4000, vencimento: '2026-12-20'},
    ];

    it('aceita parcelas que a soma bate com o valor do projeto', () =>{
        expect(validarParcelas(duas, 6000)).toEqual({});
    });

    it('recusa quando a soma nao bate', () =>{
        expect(validarParcelas([duas[0]], 6000)).toHaveProperty('soma');
    });

    it('aceita centavos sem erro de arredondamento', () => {
        const tres = [
            {valor: 33.33, vencimento: '2026-11-20'},
            {valor: 33.33, vencimento: '2026-12-20'},
            {valor: 33.34, vencimento: '2027-01-20'},
        ];
        expect(validarParcelas(tres, 100.00)).toEqual({});
    });
    
    it('exige valor maior que zero em cada parcela', () =>{
        expect(validarParcelas([{valor: 0, vencimento:'2026-11-20'}, {valor: 6000, vencimento: '2026-12-20'},], 6000)).toHaveProperty('valor');
    });

    it('exige data de vencimento', () =>{
        expect(validarParcelas([{valor: 6000}], 6000)).toHaveProperty('vencimento');
    });

    it('recusa lista vazia', () => {
        expect(validarParcelas([],6000)).toHaveProperty('geral');
    });
});