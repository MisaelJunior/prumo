import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { moeda, dataBR } from '../format.js';
import AdicionarParcelasModal from '../components/AdicionarParcelasModal.jsx';
import DarBaixaModal from '../components/DarBaixaModal.jsx';
import LancarDespesaModal from '../components/LancarDespesaModal.jsx'; // US06
import { nomeCategoria } from '../despesas.js'; // US06

const rotulo = { paga: 'Pago', atrasada: 'Atrasado', parcial: 'Parcial', 'em aberto': 'Em aberto' };

export default function ProjetoDetalhe() {
  const { id } = useParams();
  const [projeto, setProjeto] = useState(null);
  const [parcelas, setParcelas] = useState([]);
  const [despesas, setDespesas] = useState([]); // US06
  const [aberto, setAberto] = useState(false);
  const [baixa, setBaixa] = useState(null);
  const [lancando, setLancando] = useState(false); // US06
  const [erro, setErro] = useState('');
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    Promise.all([
      api(`/api/projetos/${id}`),
      api(`/api/projetos/${id}/parcelas`),
      api(`/api/projetos/${id}/despesas`), // US06
    ])
      .then(([p, ps, ds]) => { setProjeto(p); setParcelas(ps); setDespesas(ds); }) // US06
      .catch(() => setErro('Não foi possível carregar o projeto.'));
  }, [id, versao]);

  if (erro) return <p className="erro-texto">{erro}</p>;
  if (!projeto) return <p className="sub">Carregando…</p>;

  const totalC = parcelas.reduce((s, p) => s + Math.round(Number(p.valor) * 100), 0);
  const pagoC = parcelas.reduce((s, p) => s + Math.round(Number(p.valor_pago) * 100), 0);
  const emAberto = parcelas.filter((p) => p.situacao !== 'paga').length;

  return (
    <>
      <Link to="/projetos" className="voltar">← Todos os projetos</Link>
      <div className="cabecalho">
        <div>
          <h2>{projeto.descricao}</h2>
          <p className="sub">{projeto.cliente}</p>
        </div>
        <span className="chip">{projeto.status}</span>
      </div>

      <div className="cards tres">
        <div className="cartao-numero">
          <small>Valor fechado</small>
          <strong>{moeda(projeto.valor_fechado)}</strong>
        </div>
        <div className="cartao-numero">
          <small>Recebido</small>
          <strong>{moeda(pagoC / 100)}</strong>
        </div>
        <div className="cartao-numero">
          <small>A receber</small>
          <strong>{moeda((totalC - pagoC) / 100)}</strong>
          <span>{emAberto} parcelas em aberto</span>
        </div>
      </div>

      {/* US08: custo total e lucro do projeto */}
      <div className="cards">
        <div className="cartao-numero">
          <small>Custo total</small>
          <strong>{moeda(projeto.custo_total)}</strong>
        </div>
        <div className="cartao-numero">
          <small>Lucro</small>
          <strong>{moeda(projeto.lucro)}</strong>
          <span>Valor fechado menos custo total</span>
        </div>
      </div>

      <div className="cartao">
        <div className="titulo-cartao">
          <h3>Parcelas</h3>
          {parcelas.length === 0 && (
            <button className="botao" onClick={() => setAberto(true)}>+ Adicionar parcelas</button>
          )}
        </div>
        <table className="tabela">
          <thead>
            <tr><th>Parcela</th><th>Vencimento</th><th>Valor</th><th>Situação</th><th></th></tr>
          </thead>
          <tbody>
            {parcelas.map((p) => (
              <tr key={p.id}>
                <td>{p.descricao}</td>
                <td>{dataBR(p.vencimento)}</td>
                <td>{moeda(p.valor)}</td>
                <td>
                  <span className={'chip situacao ' + p.situacao.replace(' ', '-')}>{rotulo[p.situacao]}</span>
                </td>
                <td>
                  {p.situacao !== 'paga' && (
                    <button className="botao-claro botao-pequeno" onClick={() => setBaixa(p)}>Dar baixa</button>
                  )}
                </td>
              </tr>
            ))}
            {parcelas.length === 0 && (
              <tr><td colSpan="5" className="vazio">Nenhuma parcela lançada.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="cartao">
        <div className="titulo-cartao">
          <h3>Despesas</h3>
          <button className="botao" onClick={() => setLancando(true)}>+ Lançar despesa</button>
        </div>
        <table className="tabela">
          <thead>
            <tr><th>Descrição</th><th>Categoria</th><th>Data</th><th>Valor</th><th>Situação</th></tr>
          </thead>
          <tbody>
            {despesas.map((d) => (
              <tr key={d.id}>
                <td>{d.descricao}</td>
                <td>{nomeCategoria(d.categoria)}</td>
                <td>{dataBR(d.data)}</td>
                <td>{moeda(d.valor)}</td>
                <td>
                  {d.paga
                    ? <span className="chip situacao paga">Paga</span>
                    : <span className="chip situacao em-aberto">Em aberto</span>}
                </td>
              </tr>
            ))}
            {despesas.length === 0 && (
              <tr><td colSpan="5" className="vazio">Nenhuma despesa lançada.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {aberto && (
        <AdicionarParcelasModal
          projeto={projeto}
          onFechar={() => setAberto(false)}
          onSalvo={() => { setAberto(false); setVersao((v) => v + 1); }}
        />
      )}
      {baixa && (
        <DarBaixaModal
          parcela={baixa}
          onFechar={() => setBaixa(null)}
          onSalvo={() => { setBaixa(null); setVersao((v) => v + 1); }}
        />
      )}
      {lancando && (
        <LancarDespesaModal
          projeto={projeto}
          onFechar={() => setLancando(false)}
          onSalvo={() => { setLancando(false); setVersao((v) => v + 1); }}
        />
      )}
    </>
  );
}