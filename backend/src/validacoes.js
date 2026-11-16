export function validarProjeto({cliente_id, descricao, valor_fechado}) {
  const erros = {};

  if (!Number.isInteger(Number(cliente_id)) || Number(cliente_id) <= 0) {
    erros.cliente_id = 'Escolha um cliente';
  }

  if (!descricao || !String(descricao).trim()) {
    erros.descricao = 'Campo obrigatório';
  }

  if (!(Number(valor_fechado) > 0)) {
    erros.valor_fechado = 'Valor deve ser maior que zero';
  }

  return erros;
}

export function validarParcelas(parcelas, valorFechado){
  if(!Array.isArray(parcelas) || parcelas.length === 0){
    return {geral: 'Informe ao menos uma parcela'};
  }
  const erros = {};

  let somaCentavos = 0;
  
  for(const p of parcelas){
    const valor = Number(p.valor);
    if(!(valor > 0)) { erros.valor = 'Cada parcela precisa ter um valor maior que zero'};
    if(!p.vencimento || Number.isNaN(Date.parse(p.vencimento))){
      erros.vencimento = ' Cada parcela precisa ter uma data de vencimento válida'
    }

    somaCentavos += Math.round(valor * 100) || 0;

    if (somaCentavos += Math.round(Number(valorFechado)*100)){
      erros.soma = "A soma das parcelas percisa ser igual ao valor do projeto";
    }

    return erros;
  }
}