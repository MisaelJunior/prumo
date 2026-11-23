import { describe, it, expect } from 'vitest';
import { calcularLucro } from '../lucro.js';

// as despesas chegam do banco com o valor em texto, como '350.90'
const despesa = (valor) => ({ valor });

describe('calcularLucro', () => {
  it('lucro é o valor fechado menos as despesas do projeto', () => {
    const r = calcularLucro('10000.00', [despesa('3000.00'), despesa('500.50')]);

    expect(r.custo_total).toBe(3500.5);
    expect(r.lucro).toBe(6499.5);
  });
  it('projeto sem despesas tem lucro igual ao valor fechado', () => {
    const r = calcularLucro('10000.00', []);

    expect(r.custo_total).toBe(0);
    expect(r.lucro).toBe(10000);
  });
  it('recalcula o lucro quando entra uma nova despesa', () => {
    const antes = calcularLucro('1000.00', [despesa('300.00')]);
    const depois = calcularLucro('1000.00', [despesa('300.00'), despesa('200.00')]);

    expect(antes.lucro).toBe(700);
    expect(depois.lucro).toBe(500);
  });
  it('não erra a conta com centavos', () => {
    const r = calcularLucro('1000.00', [despesa('0.10'), despesa('0.20')]);

    expect(r.custo_total).toBe(0.3);
    expect(r.lucro).toBe(999.7);
  });
  it('lucro fica negativo quando as despesas passam do valor fechado', () => {
    const r = calcularLucro('1000.00', [despesa('1200.00')]);

    expect(r.lucro).toBe(-200);
  });
});
