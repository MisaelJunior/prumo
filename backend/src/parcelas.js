export const hojeISO = () =>
  new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });

export function situacaoParcela({ valor, valor_pago, vencimento }, hoje) {
  const total = Math.round(Number(valor) * 100);

  const pago = Math.round(Number(valor_pago) * 100);

  if (pago >= total) return 'paga';

  if (vencimento < hoje) return 'atrasada';
  
  return pago > 0 ? 'parcial' : 'em aberto';
}