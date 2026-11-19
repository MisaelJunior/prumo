import { describe, it, expect } from 'vitest';
import { diasDeAtraso, valorEmAberto } from '../atrasos.js';

const hoje = '2026-11-18';

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