import { describe, it, expect } from 'vitest';
import { validarBaixa } from '../validacoes.js';

const aberta = { valor: '6000.00', valor_pago: '0.00' };

describe('validarBaixa', () => {
  it('aceita a baixa total', () => {
    expect(validarBaixa(aberta, 6000)).toEqual({});
  });
  it('aceita baixa parcial', () => {
    expect(validarBaixa(aberta, 2500)).toEqual({});
  });
  it('aceita receber o saldo que sobrou', () => {
    expect(validarBaixa({ valor: '6000.00', valor_pago: '2500.00' }, 3500)).toEqual({});
  });
  it('recusa valor maior que o saldo', () => {
    expect(validarBaixa(aberta, 6000.01)).toHaveProperty('valor');
    expect(validarBaixa({ valor: '6000.00', valor_pago: '2500.00' }, 3500.01)).toHaveProperty('valor');
  });
  it('recusa valor zero, negativo ou vazio', () => {
    expect(validarBaixa(aberta, 0)).toHaveProperty('valor');
    expect(validarBaixa(aberta, -50)).toHaveProperty('valor');
    expect(validarBaixa(aberta, '')).toHaveProperty('valor');
  });
  it('recusa baixa em parcela já paga', () => {
    expect(validarBaixa({ valor: '6000.00', valor_pago: '6000.00' }, 100)).toHaveProperty('geral');
  });
});