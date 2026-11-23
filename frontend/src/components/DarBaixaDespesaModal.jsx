import { useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api.js';
import { moeda } from '../format.js';

export default function DarBaixaDespesaModal({ despesa, onFechar, onSalvo }) {
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function confirmar(e) {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    try {
      await api(`/api/despesas/${despesa.id}/pagar`, { method: 'PATCH' });
      onSalvo();
    } catch {
      setErro('Não foi possível marcar como paga. Tente novamente.');
      setSalvando(false);
    }
  }

  return (
    <Modal titulo="Dar baixa na despesa" onFechar={onFechar}>
      <form className="formulario" onSubmit={confirmar}>
        <p className="sub">
          <strong>{despesa.descricao}</strong> · {moeda(despesa.valor)}
        </p>

        <p style={{ margin: '8px 0', fontSize: '14px' }}>
          Confirmar o pagamento desta despesa? Ela será marcada como <strong>paga</strong>.
        </p>

        {erro && <span className="msg-erro">{erro}</span>}

        <div className="acoes">
          <button type="button" className="botao-claro" onClick={onFechar} disabled={salvando}>
            Cancelar
          </button>
          <button type="submit" className="botao" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Confirmar pagamento'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
