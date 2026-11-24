import { useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api.js';
import { hojeISO } from '../despesas.js';

export default function LancarDespesaFixaModal({ onFechar, onSalvo }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [vencimento, setVencimento] = useState(hojeISO());
  const [repetirMeses, setRepetirMeses] = useState('');
  const [paga, setPaga] = useState(false);
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  async function salvar(evento) {
    evento.preventDefault();
    setSalvando(true);
    setErros({});

    try {
      await api('/api/despesas', {
        method: 'POST',
        body: {
          descricao,
          valor,
          vencimento,
          repetir_meses: repetirMeses ? Number(repetirMeses) : undefined,
          paga,
        },
      });
      onSalvo();
    } catch (err) {
      setErros(err.erros ?? { geral: 'Não foi possível salvar a despesa. Tente de novo.' });
      setSalvando(false);
    }
  }

  return (
    <Modal titulo="Nova despesa fixa" onFechar={onFechar}>
      <form className="formulario" onSubmit={salvar} noValidate>
        <p className="sub">Cadastre custos fixos do negócio (aluguel, energia, internet, etc.).</p>

        <label>
          Descrição
          <input
            className={'campo' + (erros.descricao ? ' erro' : '')}
            placeholder="Ex: Aluguel da oficina"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          {erros.descricao && <span className="msg-erro">{erros.descricao}</span>}
        </label>

        <label>
          Valor (R$)
          <input
            className={'campo' + (erros.valor ? ' erro' : '')}
            type="number"
            step="0.01"
            placeholder="0,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
          {erros.valor && <span className="msg-erro">{erros.valor}</span>}
        </label>

        <label>
          Vencimento
          <input
            className={'campo' + (erros.vencimento ? ' erro' : '')}
            type="date"
            value={vencimento}
            onChange={(e) => setVencimento(e.target.value)}
          />
          {erros.vencimento && <span className="msg-erro">{erros.vencimento}</span>}
        </label>

        <label>
          Repetir lançamento mensalmente
          <input
            className={'campo' + (erros.repetir_meses ? ' erro' : '')}
            type="number"
            min="1"
            max="60"
            placeholder="1 (opcional, até 60 meses)"
            value={repetirMeses}
            onChange={(e) => setRepetirMeses(e.target.value)}
          />
          <small className="sub">Deixe em branco ou 1 para lançar só este mês.</small>
          {erros.repetir_meses && <span className="msg-erro">{erros.repetir_meses}</span>}
        </label>

        <label className="marcar">
          <input
            type="checkbox"
            checked={paga}
            onChange={(e) => setPaga(e.target.checked)}
          />
          Já foi paga
        </label>

        {erros.geral && <span className="msg-erro">{erros.geral}</span>}

        <div className="acoes">
          <button type="button" className="botao-claro" onClick={onFechar} disabled={salvando}>
            Cancelar
          </button>
          <button type="submit" className="botao" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar despesa'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
