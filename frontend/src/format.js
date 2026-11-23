export const moeda = (valor) => Number(valor).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
export const dataBR = (iso) => iso.split('-').reverse().join('/');
export const dataCurta = (iso) => {
  if (!iso) return '';
  const [ano, mes, dia] = iso.split('-').map(Number);
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${dia} ${meses[mes - 1]} ${ano}`;
};