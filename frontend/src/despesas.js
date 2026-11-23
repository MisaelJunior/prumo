export const categoriasPermitidas = [
  { valor: 'material', nome: 'Material' },
  { valor: 'frete', nome: 'Frete' },
  { valor: 'terceirizado', nome: 'Terceirizados' },
  { valor: 'outros', nome: 'Outros' },
];

export const nomeCategoria = (valor) => categoriasPermitidas.find((c) => c.valor === valor)?.nome ?? '-';

export const hojeISO = () => new Date().toLocaleDateString('sv-SE');

const centavos = (valor) => Math.round(Number(valor) * 100);

export function resumirDespesas(despesas, hoje = hojeISO()) {
  const abertas = despesas.filter((d) => !d.paga);
  const atrasadas = abertas.filter((d) => d.data < hoje);
  const somar = (lista) => lista.reduce((soma, d) => soma + centavos(d.valor), 0) / 100;

  return {
    total_em_aberto: somar(abertas),
    quantidade_em_aberto: abertas.length,
    atrasadas: { quantidade: atrasadas.length, total: somar(atrasadas) },
  };
}