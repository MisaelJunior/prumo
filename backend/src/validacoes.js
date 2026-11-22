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

export function validarParcelas(parcelas, valorFechado) {
  if (!Array.isArray(parcelas) || parcelas.length === 0) {
    return { geral: 'Informe ao menos uma parcela' };
  }
  const erros = {};

  let somaCentavos = 0;

  for (const p of parcelas) {
    const valor = Number(p.valor);
    if (!(valor > 0)) {
      erros.valor = 'Cada parcela precisa ter um valor maior que zero';
    }
    if (!p.vencimento || Number.isNaN(Date.parse(p.vencimento))) {
      erros.vencimento =
        ' Cada parcela precisa ter uma data de vencimento válida';
    }

    somaCentavos += Math.round(valor * 100) || 0;
  }
  if (somaCentavos !== Math.round(Number(valorFechado) * 100)) {
    erros.soma = 'A soma das parcelas percisa ser igual ao valor do projeto';
  }

  return erros;
}

export function validarBaixa(parcela, valorRecebido) {
  const saldo =
    Math.round(Number(parcela.valor) * 100) -
    Math.round(Number(parcela.valor_pago) * 100);

  if (saldo <= 0) return { geral: "Esta parcela já está paga" };
  
  const valor = Math.round(Number(valorRecebido) * 100);

  if (!(valor > 0)) return { valor: "Informe um valor maior que zero" };

  if (valor > saldo) return { valor: "O valor não pode ser maior que o saldo da parcela" };
  return {};
}

function dataValida(texto) {
    if (typeof texto !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
    const [ano, mes, dia] = texto.split('-').map(Number);
    const d = new Date(Date.UTC(ano, mes - 1, dia));
    return d.getUTCFullYear() === ano && d.getUTCMonth() === mes - 1 && d.getUTCDate() === dia;
  }

export function validarDespesaProjeto({descricao, valor, data, categoria}){
  const erros = {};
  const categoriasPermitidas = ['material', 'frete', 'terceirizado', 'outros'];


  if (!descricao || !String(descricao).trim()) {
    erros.descricao = 'Campo obrigatório';
  }

  if (!(Number(valor) > 0)) {
    erros.valor = 'Valor inválido';
  }

  if(!dataValida(data)){
    erros.data = 'informe uma data válida'
  }

  if (categoria != null && categoria !== '' && !categoriasPermitidas.includes(categoria)){
    erros.categoria = 'Escolha uma categoria da lista';
  }

  return erros
}