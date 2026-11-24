import { describe, it, expect } from 'vitest';
import { validarDespesaFixa } from '../validacoes.js';

const valida = {
    descricao: 'Aluguel da oficina',
    valor: 1800,
    vencimento: '2026-12-05',
};

describe('validarDespesaFixa', () => {
    it('aceita uma despesa fixa válida, sem projeto e sem repetição', () => {
        expect(validarDespesaFixa(valida)).toEqual({});
    });

    // descrição
    it('exige descrição', () => {
        expect(validarDespesaFixa({ ...valida, descricao: '' })).toHaveProperty('descricao');
    });
    it('recusa descrição só com espaços', () => {
        expect(validarDespesaFixa({ ...valida, descricao: '   ' })).toHaveProperty('descricao');
    });

    // valor
    it.each([0, -5, '', 'abc'])('recusa valor %s', (valor) => {
        expect(validarDespesaFixa({ ...valida, valor })).toHaveProperty('valor');
    });

    // vencimento
    it('exige vencimento', () => {
        expect(validarDespesaFixa({ ...valida, vencimento: undefined })).toHaveProperty('vencimento');
    });
    it('recusa vencimento em formato errado', () => {
        expect(validarDespesaFixa({ ...valida, vencimento: '05/12/2026' })).toHaveProperty('vencimento');
    });
    it('recusa vencimento que não existe', () => {
        expect(validarDespesaFixa({ ...valida, vencimento: '2026-02-30' })).toHaveProperty('vencimento');
    });

    // repetição mensal
    it.each([1, 12, 60, '12'])('aceita repetir por %s meses', (repetir_meses) => {
        expect(validarDespesaFixa({ ...valida, repetir_meses })).toEqual({});
    });
    it.each([0, -3, 61, 2.5, 'abc'])('recusa repetir por %s meses', (repetir_meses) => {
        expect(validarDespesaFixa({ ...valida, repetir_meses })).toHaveProperty('repetir_meses');
    });
    it.each([undefined, null, ''])('sem repetição informada (%s), passa sem erro', (repetir_meses) => {
        expect(validarDespesaFixa({ ...valida, repetir_meses })).toEqual({});
    });
});