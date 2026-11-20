import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { moeda, dataBR } from "../format.js";
import DarBaixaModal from "../components/DarBaixaModal.jsx";

export default function AReceber() {
    const [parcelas, setParcelas] = useState([]);
    const [erro, setErro] = useState('');
    const [baixa, setBaixa] = useState(null);
    const [versao, setVersao] = useState(0);

    useEffect(() => {
        api('/api/parcelas/atrasadas')
            .then(setParcelas)
            .catch(() => setErro('Não foi possível carregar as parcelas atrasadas.'));
    }, [versao]);

    const totalCent = parcelas.reduce(
        (soma, p) => soma + Math.round(Number(p.valor_em_aberto) * 100), 0
    );

    return (
        <>
            <div className="cabecalho">
                <div>
                    <h2>A receber</h2>
                    <p className="sub">Acompanhe as parcelas dos seus projetos.</p>
                </div>
            </div>

            {erro && <p className="erro-texto">{erro}</p>}

            {parcelas.length > 0 && (
                <div className="cards">
                    <div className="cartao-numero">
                        <small>Total em atraso</small>
                        <strong>{moeda(totalCent / 100)}</strong>
                        <span>
                            {parcelas.length} {parcelas.length === 1 ? 'parcela atrasada' : 'parcelas atrasadas'}
                        </span>
                    </div>
                </div>
            )}

            <div className="cartao">
                <table className="tabela">
                    <thead>
                        <tr>
                            <th>Lançamento</th><th>Vencimento</th><th>Valor</th><th>Situação</th><th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcelas.map((p) => (
                            <tr key={p.id}>
                                <td>
                                    <Link to={`/projetos/${p.projeto_id}`} className="linha-link">{p.projeto}</Link>
                                    <br />
                                    <span className="sub">{p.cliente} · {p.descricao}</span>
                                </td>
                                <td>{dataBR(p.vencimento)}</td>
                                <td>{moeda(p.valor_em_aberto)}</td>
                                <td><span className="chip situacao atrasada">Atrasado</span></td>
                                <td>
                                    <button
                                        className="botao-claro botao-pequeno"
                                        onClick={() => setBaixa({
                                            id: p.id,
                                            descricao: `${p.projeto} · ${p.descricao}`,
                                            valor: p.valor_em_aberto,
                                            valor_pago: 0,
                                        })}
                                    >
                                        Dar baixa
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {parcelas.length === 0 && (
                            <tr><td colSpan="5" className="vazio">Nenhuma parcela atrasada.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {baixa && (
                <DarBaixaModal
                    parcela={baixa}
                    onFechar={() => setBaixa(null)}
                    onSalvo={() => { setBaixa(null); setVersao((v) => v + 1); }}
                />
            )}
        </>
    );
}