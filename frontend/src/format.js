export const moeda = (valor) => Number(valor).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
export const dataBR = (iso) => iso.split('-').reverse().join('/');