import { useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api.js';
import { categoriasPermitidas, hojeISO } from '../despesas.js';

export default function LancarDespesaModal({ projeto, onFechar, onSalvo }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(hojeISO());
  const [categoria, setCategoria] = useState('material');
  const [paga, setPaga] = useState(false);
  const [erros, setErros] = useState({});

  async function salvar(evento) {
    evento.preventDefault();
    try {
      await api(`/api/projetos/${projeto.id}/despesas`, {
        method: 'POST',
        body: { descricao, valor, data, categoria, paga},
      });
      onSalvo();
    } catch (err) {
      setErros(err.erros ?? { geral: 'Não foi possível salvar. Tente de novo.' });
    }
  }

  return (
    <Modal titulo="Lançar despesa" onFechar={onFechar}>
      <form className="formulario" onSubmit={salvar} noValidate>
        <p className="sub">Projeto: {projeto.descricao}</p>

        <label>
          Descrição
          <input className={'campo' + (erros.descricao ? ' erro' : '')} value={descricao}
            onChange={(e) => setDescricao(e.target.value)} />
          {erros.descricao && <span className="msg-erro">{erros.descricao}</span>}
        </label>

        <label>
          Valor (R$)
          <input className={'campo' + (erros.valor ? ' erro' : '')} type="number" step="0.01"
            value={valor} onChange={(e) => setValor(e.target.value)} />
          {erros.valor && <span className="msg-erro">{erros.valor}</span>}
        </label>

        <label>
          Data
          <input className={'campo' + (erros.data ? ' erro' : '')} type="date"
            value={data} onChange={(e) => setData(e.target.value)} />
          {erros.data && <span className="msg-erro">{erros.data}</span>}
        </label>

        <label>
          Categoria
          <select className="campo" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            {categoriasPermitidas.map((c) => (
              <option key={c.valor} value={c.valor}>{c.nome}</option>
            ))}
          </select>
        </label>

        <label className="marcar">
          <input type="checkbox" checked={paga} onChange={(e) => setPaga(e.target.checked)} />
          Já foi paga
        </label>

        {erros.geral && <span className="msg-erro">{erros.geral}</span>}

        <div className="acoes">
          <button type="button" className="botao-claro" onClick={onFechar}>Cancelar</button>
          <button type="submit" className="botao">Salvar</button>
        </div>
      </form>
    </Modal>
  );
}