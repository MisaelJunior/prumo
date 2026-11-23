// US08: lucro do projeto = valor fechado menos as despesas vinculadas a ele
const paraCent = (valor) => Math.round(Number(valor) * 100);

export function calcularLucro(valorFechado, despesas) {
  const custo = despesas.reduce((soma, d) => soma + paraCent(d.valor), 0);

  return {
    custo_total: custo / 100,
    lucro: (paraCent(valorFechado) - custo) / 100,
  };
}
