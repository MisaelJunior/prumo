import { describe, it, expect } from 'vitest';
import { situacaoDespesa, resumirDespesas } from '../despesas.js';

const hoje = '2026-11-12';

const despesa = (extra) => ({
    id: 1,
    descricao: 'Aluguel',
    valor: '1000.00',
    data: '2026-11-20',
    paga: false,
    ...extra,
});

describe('situacaoDespesa', () => {
    it('é paga quando foi marcada como paga, mesmo vencida', () => {
        expect(situacaoDespesa(despesa({ paga: true, data: '2026-11-01' }), hoje)).toBe('paga');
    });
    it('é atrasada quando venceu antes de hoje e não foi paga', () => {
        expect(situacaoDespesa(despesa({ data: '2026-11-11' }), hoje)).toBe('atrasada');
    });
    it('vencer hoje ainda é em aberto', () => {
        expect(situacaoDespesa(despesa({ data: hoje }), hoje)).toBe('em aberto');
    });
    it('vencer no futuro é em aberto', () => {
        expect(situacaoDespesa(despesa({ data: '2026-12-01' }), hoje)).toBe('em aberto');
    });
});

describe('resumirDespesas', () => {
    it('reproduz o cartão do design: 4 em aberto, 1 atrasada', () => {
        const lista = [
            despesa({ id: 1, valor: '3200.00', data: '2026-11-10' }),
            despesa({ id: 2, valor: '2800.00', data: '2026-11-18' }),
            despesa({ id: 3, valor: '400.00', data: '2026-11-20' }),
            despesa({ id: 4, valor: '2000.00', data: '2026-11-24' }),
        ];

        expect(resumirDespesas(lista, hoje)).toEqual({
            total_em_aberto: 8400,
            quantidade_em_aberto: 4,
            atrasadas: { quantidade: 1, total: 3200 },
        });
    });
    it('ignora despesas já pagas', () => {
        const lista = [
            despesa({ valor: '500.00' }),
            despesa({ id: 2, valor: '900.00', paga: true }),
        ];
        const r = resumirDespesas(lista, hoje);

        expect(r.total_em_aberto).toBe(500);
        expect(r.quantidade_em_aberto).toBe(1);
    });
    it('sem despesas, tudo zerado', () => {
        expect(resumirDespesas([], hoje)).toEqual({
            total_em_aberto: 0,
            quantidade_em_aberto: 0,
            atrasadas: { quantidade: 0, total: 0 },
        });
    });
    it('soma centavos sem erro de arredondamento', () => {
        const lista = [despesa({ valor: '0.10' }), despesa({ id: 2, valor: '0.20' })];

        expect(resumirDespesas(lista, hoje).total_em_aberto).toBe(0.3);
    });
    it('despesa paga e vencida não conta como atrasada', () => {
        const r = resumirDespesas([despesa({ data: '2026-11-01', valor: '900.00', paga: true })], hoje);

        expect(r.atrasadas).toEqual({ quantidade: 0, total: 0 });
        expect(r.quantidade_em_aberto).toBe(0);
    });
    it('a que vence hoje não conta como atrasada', () => {
        const r = resumirDespesas([despesa({ data: hoje })], hoje);

        expect(r.atrasadas).toEqual({ quantidade: 0, total: 0 });
        expect(r.quantidade_em_aberto).toBe(1);
    });
});