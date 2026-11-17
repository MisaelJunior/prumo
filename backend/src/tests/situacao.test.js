import { describe, it, expect } from 'vitest';
import { situacaoParcela } from '../parcelas.js';

const hoje = '2026-11-16';

describe('situacaoParcela', () => {
  it('paga quando o valor pago cobre a parcela', () => {
    expect(situacaoParcela({ valor: '6000.00', valor_pago: '6000.00', vencimento: '2026-11-01' }, hoje)).toBe('paga');
  });
  it('atrasada quando venceu e não foi paga', () => {
    expect(situacaoParcela({ valor: '6000.00', valor_pago: '0.00', vencimento: '2026-11-05' }, hoje)).toBe('atrasada');
  });
  it('em aberto quando vence hoje', () => {
    expect(situacaoParcela({ valor: '6000.00', valor_pago: '0.00', vencimento: '2026-11-16' }, hoje)).toBe('em aberto');
  });
  it('em aberto quando vence no futuro', () => {
    expect(situacaoParcela({ valor: '6000.00', valor_pago: '0.00', vencimento: '2026-12-05' }, hoje)).toBe('em aberto');
  });
  it('parcial quando pagou parte e ainda não venceu', () => {
    expect(situacaoParcela({ valor: '6000.00', valor_pago: '2000.00', vencimento: '2026-12-05' }, hoje)).toBe('parcial');
  });
  it('atrasada quando pagou parte mas já venceu', () => {
    expect(situacaoParcela({ valor: '6000.00', valor_pago: '2000.00', vencimento: '2026-11-05' }, hoje)).toBe('atrasada');
  });
});