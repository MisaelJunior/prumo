import { describe, it, expect } from "vitest";
import { gerarVencimentosMensais } from "../despesas.js";

describe('gerarVencimentosMensais', () => {
    it('sem repetição, devolve a data original', () => {
        expect(gerarVencimentosMensais('2026-12-05', 1)).toEqual(['2026-12-05']);
    });
    it('repete no mesmo dia, mes a mes, passando pela virada de ano', () => {
        expect(gerarVencimentosMensais('2026-11-05', 3)).toEqual(['2026-11-05', '2026-12-05', '2027-01-05']);
    });
    it('cai no último dia do mês curto, e volta ao 31 quando o mês permite', () => {
        expect(gerarVencimentosMensais('2027-01-31', 4)).toEqual(['2027-01-31', '2027-02-28', '2027-03-31', '2027-04-30']);
    });
    it('correção para ano bissexto', () => {
        expect(gerarVencimentosMensais('2028-01-30', 2)).toEqual(['2028-01-30', '2028-02-29']);
    });
});