import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { moeda, dataBR } from '../format.js';
import AdicionarParcelasModal from '../components/AdicionarParcelasModal.jsx';

export default function ProjetoDetalhe(){
    const {id} = useParams();
    const [projeto, setProjeto] = useState(null);
    const [parcelas, setParcelas] = useState([]);
    const [aberto, setAberto] = useState(false);
    const [erro, setErro] = useState('');
    const [versao, setVersao] = useState(0);

    useEffect(() => {
    Promise.all([api(`/api/projetos/${id}`), api(`/api/projetos/${id}/parcelas`)])
      .then(([p, ps]) => { setProjeto(p); setParcelas(ps); })
      .catch(() => setErro('Não foi possível carregar o projeto.'));
    }, [id, versao]);

    if (erro) return <p className="erro-texto">{erro}</p>;
    if (!projeto) return <p className="sub">Carregando…</p>;

    const parcelado = parcelas.reduce((s, p) => s + Number(p.valor), 0);

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

        <div className="cards">
            <div className="cartao-numero">
            <small>Valor fechado</small>
            <strong>{moeda(projeto.valor_fechado)}</strong>
            </div>
            <div className="cartao-numero">
            <small>Em parcelas</small>
            <strong>{moeda(parcelado)}</strong>
            <span>{parcelas.length} lançamentos</span>
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
                <tr><th>Parcela</th><th>Vencimento</th><th>Valor</th></tr>
            </thead>
            <tbody>
                {parcelas.map((p) => (
                <tr key={p.id}>
                    <td>{p.descricao}</td>
                    <td>{dataBR(p.vencimento)}</td>
                    <td>{moeda(p.valor)}</td>
                </tr>
                ))}
                {parcelas.length === 0 && (
                <tr><td colSpan="3" className="vazio">Nenhuma parcela lançada.</td></tr>
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
        </>
    );
}