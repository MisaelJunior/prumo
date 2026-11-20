import { describe, it, expect } from 'vitest';
import { diasDeAtraso, valorEmAberto, listarAtrasadas } from '../atrasos.js';

const hoje = '2026-11-18';

const parcela = (extra) => ({
    id: 1,
    projeto_id:10,
    cliente: 'Maria',
    projeto: 'Armário de cozinha',
    valor: '1000.00',
    valor_pago: '0.00',
    vencimento: '2026-11-10',
    ...extra,
});

describe ('diasDeAtraso', () => {
    it('conta os dias entre o vencimento e hoje', () => {
        expect(diasDeAtraso('2026-11-10', hoje)).toBe(8);
    });
    it('conta os dias do vencimento no fim do mês anterior', () => {
        expect(diasDeAtraso('2026-10-30', hoje)).toBe(19);
    });
    it('conta os dias do vencimento, sendo que vence hoje', () => {
        expect(diasDeAtraso('2026-11-18', hoje)).toBe(0);
    });
});

describe ('valorEmAberto', () =>{
    it('subtrai o valor já abatido do total', () => {
        expect(valorEmAberto('1000.00', '250.50')).toBe(749.5);
    });
    it('não erra a conta com centavos', () => {
        expect(valorEmAberto('0.30', '0.10')).toBe(0.2);
    });
    it('sem nenhum pagamento, o valor em aberto é o total', () => {
        expect(valorEmAberto('1000.00', '0.00')).toBe(1000);
    });
});

describe ('listarAtrasadas', () =>{
    it('lista a parcela não paga com vencimento anterior a hoje', () =>{
        const resultado = listarAtrasadas ([parcela()], hoje);

        expect(resultado).toHaveLength(1);
        expect(resultado[0].cliente).toBe('Maria');
        expect(resultado[0].projeto).toBe('Armário de cozinha');
        expect(resultado[0].valor_em_aberto).toBe(1000);
        expect(resultado[0].dias_atraso).toBe(8);
    });
    it('mostra só o saldo quando houve baixa parcial', () => {
        const resultado = listarAtrasadas ([parcela({valor_pago: '400.00'})], hoje);

        expect(resultado[0].valor_em_aberto).toBe(600);
    });
    it('não lista parcela já paga, mesmo vencida', () => {
        const resultado = listarAtrasadas ([parcela({valor_pago: '1000.00'})], hoje);

        expect(resultado).toEqual([]);
    });
    it('não lista a parcela que vence hoje ou no futuro', () => {
        const resultado = listarAtrasadas ([
            parcela({vencimento: hoje }),
            parcela({id: 2, vencimento: '2026-12-01'}),
        ], hoje);

        expect(resultado).toEqual([]);
    });
    it('orddernar da parcela mais antiga para a mais recente', () => {
        const resultado = listarAtrasadas ([
            parcela({id: 1, vencimento: '2026-11-15'}),
            parcela({id: 2, vencimento: '2026-10-01'}),
            parcela({id: 3, vencimento: '2026-11-02'}),
        ], hoje);

        expect(resultado.map((p) => p.id)).toEqual([2,3,1]);
    });
    it('devolve uma lista vazia quando não há atrasos', () => {
        const resultado = listarAtrasadas ([], hoje);

        expect(resultado).toEqual([]);
    });
});