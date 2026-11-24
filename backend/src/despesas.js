export function gerarVencimentosMensais(vencimento, quantidade = 1) {
    const [ano, mes, dia] = vencimento.split('-').map(Number);
    const datas = [];

    for (let i = 0; i< quantidade; i++) {
      const alvo = new Date(Date.UTC(ano, mes -1 + i, 1));
      const anoAlvo = alvo.getUTCFullYear();
      const mesAlvo = alvo.getUTCMonth();

      const diaDoMes = new Date(Date.UTC(anoAlvo, mesAlvo +1, 0)).getUTCDate();

      const diaFinal = Math.min(dia, diaDoMes);

      const mm = String(mesAlvo + 1).padStart(2, '0');
      const dd = String(diaFinal).padStart(2, '0');
      datas.push(`${anoAlvo}-${mm}-${dd}`);
    }

    return datas;
}

export function situacaoDespesa({paga, data}, hoje) {
  if (paga) return 'paga';
  return data < hoje ? 'atrasada' : 'em aberto';
}

const centavos = (valor) => Math.round(Number(valor) * 100);

export function resumirDespesas(despesas, hoje) {
  const abertas = despesas.filter((d) => !d.paga);
  const atrasadas = abertas.filter((d) => d.data < hoje);
  const somar = (lista) => lista.reduce((soma, d) => soma + centavos(d.valor), 0) / 100;

  return {
    total_em_aberto: somar(abertas),
    quantidade_em_aberto: abertas.length,
    atrasadas: { quantidade: atrasadas.length, total: somar(atrasadas)},
  };
}