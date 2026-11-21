import { describe, it, expect } from "vitest";
import { validarDespesaProjeto } from "../validacoes.js";

const valida = {
    descricao: 'Chapas de MDF',
    valor: 350.9,
    data: '2026-11-18',
    categoria: 'material',
}

describe('validarDespesaProjeto', () => {
    it('aceita uma despesa valida', () => {
        expect(validarDespesaProjeto(valida)).toEqual({});
    });
    // descricao
    it('exige descricao', () => {
        expect(validarDespesaProjeto({ ...valida, descricao:''})).toHaveProperty('descricao');
    });
    it('recusa descricao so com espaco', () => {
        expect(validarDespesaProjeto({ ...valida, descricao: '    ' })).toHaveProperty('descricao');
    });

    //valor
    it('recusa valor zero', () => {
        expect(validarDespesaProjeto({ ...valida, valor: 0 })).toHaveProperty('valor');
    });
    it('recusa valor negativo', () => {
        expect(validarDespesaProjeto({ ...valida, valor: -5 })).toHaveProperty('descricao');
    });
    it('recusa valor vazio ou em texto', () => {
        expect(validarDespesaProjeto({ ...valida, valor: '' })).toHaveProperty('valor');
        expect(validarDespesaProjeto({ ...valida, valor: 'abc' })).toHaveProperty('valor');
    });

    //data
    it('exige data', () =>{
        expect(validarDespesaProjeto({...valida, data:undefined})).toHaveProperty('data');
    });
    it('recusa data em formato errado', () =>{
        expect(validarDespesaProjeto({...valida, data:'18/11/2026'})).toHaveProperty('data');
    });
    it('recusa data que não existe', () =>{
        expect(validarDespesaProjeto({...valida, data:'2026-02-30'})).toHaveProperty('data');
    });

    //categoria
    it('aceita todas as categorias prevista', () => {
        for (const categoria of ['material', 'frete', 'tercerizados', 'outros']) {
            expect(validarDespesaProjeto({ ...valida, categoria})).toEqual({});
        }
    });
    it('recusa categoria fora da lista', () =>{
        expect(validarDespesaProjeto({...valida, data:'viagem'})).toHaveProperty('categoria');
    });
    it('aceita despesa sem categoria', () =>{
        expect(validarDespesaProjeto({...valida, data:undefined})).toEqual({});
    });
    
    
});