import { useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api.js';
import { moeda } from '../format.js';

export default function DarBaixaModal({ parcela, onFechar, onSalvo }) {
  const saldo = (Math.round(Number(parcela.valor) * 100) - Math.round(Number(parcela.valor_pago) * 100)) / 100;
  const [valor, setValor] = useState(saldo.toFixed(2));
  const [erro, setErro] = useState('');

  async function salvar(evento) {
    evento.preventDefault();
    try {
      await api(`/api/parcelas/${parcela.id}/baixa`, { method: 'POST', body: { valor } });
      onSalvo();
    } catch (err) {
      const recebidos = err.erros ?? {};
      setErro(recebidos.valor ?? recebidos.geral ?? 'Não foi possível dar baixa. Tente de novo.');
    }
  }

  return (
    <Modal titulo="Dar baixa" onFechar={onFechar}>
      <form className="formulario" onSubmit={salvar} noValidate>
        <p className="sub">{parcela.descricao} · saldo de {moeda(saldo)}</p>
        <label>
          Valor recebido (R$)
          <input className={'campo' + (erro ? ' erro' : '')} type="number" step="0.01"
            value={valor} onChange={(e) => setValor(e.target.value)} />
          {erro && <span className="msg-erro">{erro}</span>}
        </label>
        <p className="sub">Para uma baixa parcial, digite um valor menor que o saldo.</p>
        <div className="acoes">
          <button type="button" className="botao-claro" onClick={onFechar}>Cancelar</button>
          <button type="submit" className="botao">Confirmar</button>
        </div>
      </form>
    </Modal>
  );
}