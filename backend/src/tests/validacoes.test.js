import { describe, it, expect } from 'vitest';
import { validarProjeto } from '../validacoes.js';

describe('validarProjeto', () => {
    const valido = { cliente_id: 1, descricao: 'Armario de cozinha planejado', valor_fechado: 8000};

  it('aceita um projeto valido', () => {
    expect(validarProjeto(valido)).toEqual({});
  });

  it('exige descricao', () => {
   expect(validarProjeto({ ...valido, descricao: '' })).toHaveProperty('descricao');
  });

  it('exige valor maior que zero', () => {
    expect(validarProjeto({ ...valido, valor_fechado: 0 })).toHaveProperty('valor_fechado');
    expect(validarProjeto({ ...valido, valor_fechado: -10 })).toHaveProperty('valor_fechado');
  });

  it('exige cliente', () => {
    expect(validarProjeto({ ...valido, cliente_id: undefined })).toHaveProperty('cliente_id');
  });
});
