import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { moeda } from '../format.js';
import NovoProjetoModal from '../components/NovoProjetoModal.jsx';
import {Link} from 'react-router-dom';

export default function Projetos() {
  const [projetos, setProjetos] = useState([]);
  const [busca, setBusca] = useState('');
  const [aberto, setAberto] = useState(false);
  const [erro, setErro] = useState('');
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    api('/api/projetos')
      .then(setProjetos)
      .catch(() => setErro('Não foi possível carregar os projetos.'));
  }, [versao]);

  const filtrados = projetos.filter((p) =>
    `${p.descricao} ${p.cliente}`.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <div className="cabecalho">
        <div>
          <h2>Projetos</h2>
          <p className="sub">Cada projeto, seus valores e seu resultado.</p>
        </div>
        <button className="botao" onClick={() => setAberto(true)}>+ Novo projeto</button>
      </div>

      <input className="busca" placeholder="Buscar por projeto ou cliente"
        value={busca} onChange={(e) => setBusca(e.target.value)} />
      {erro && <p className="erro-texto">{erro}</p>}

      <div className="cartao">
        <table className="tabela">
          <thead>
            <tr><th>Projeto</th><th>Cliente</th><th>Valor</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtrados.map((p) => (
              <tr key={p.id}>
                <td><Link to={`/projetos/${p.id}`} className="linha-link">{p.descricao}</Link></td>
                <td>{p.cliente}</td>
                <td>{moeda(p.valor_fechado)}</td>
                <td><span className="chip">{p.status}</span></td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr><td colSpan="4" className="vazio">Nenhum projeto ainda.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {aberto && (
        <NovoProjetoModal
          onFechar={() => setAberto(false)}
          onSalvo={() => { setAberto(false); setVersao((v) => v + 1); }}
        />
      )}
    </>
  );
}