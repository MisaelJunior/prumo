import { describe, it, expect } from 'vitest';
import { diasDeAtraso } from '../atrasos.js';

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