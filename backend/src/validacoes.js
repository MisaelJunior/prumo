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