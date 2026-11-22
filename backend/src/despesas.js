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