export const categoriasPermitidas = [
  { valor: 'material', nome: 'Material' },
  { valor: 'frete', nome: 'Frete' },
  { valor: 'terceirizado', nome: 'Terceirizado' },
  { valor: 'outros', nome: 'Outros' },
];

export const nomeCategoria = (valor) => categoriasPermitidas.find((c) => c.valor === valor)?.nome ?? '-';

export const hojeISO = () => new Date().toLocaleDateString('sv-SE');