import { useEffect, useState } from "react";
import { api } from "../api.js";
import { moeda, dataCurta } from "../format.js";
import { hojeISO, resumirDespesas } from "../despesas.js";
import LancarDespesaFixaModal from "../components/LancarDespesaFixaModal.jsx";
import DarBaixaDespesaModal from "../components/DarBaixaDespesaModal.jsx";

const nomesMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function formatarMesAno(anoMes) {
  if (!anoMes || anoMes === "todos") return "Todos os meses";
  const [ano, mes] = anoMes.split("-").map(Number);
  return `${nomesMeses[mes - 1]} de ${ano}`;
}

export default function APagar() {
  const [despesas, setDespesas] = useState([]);
  const [erro, setErro] = useState("");
  const [baixa, setBaixa] = useState(null);
  const [modalNova, setModalNova] = useState(false);
  const [versao, setVersao] = useState(0);

  const mesAtual = hojeISO().slice(0, 7);
  const [mesSelecionado, setMesSelecionado] = useState(mesAtual);

  useEffect(() => {
    api("/api/despesas")
      .then((dados) => {
        setDespesas(dados);
        // Se o mês atual não tiver despesas mas tiver em outro mês, mantém o mês atual ou primeiro
      })
      .catch(() => setErro("Não foi possível carregar as contas a pagar."));
  }, [versao]);

  // Lista os meses que possuem despesas, mais o mês atual
  const mesesDisponiveis = Array.from(
    new Set([mesAtual, ...despesas.map((d) => d.data.slice(0, 7))])
  ).sort();

  // Filtra as despesas pelo mês selecionado (ou todas se selecionado "todos")
  const despesasFiltradas = despesas.filter(
    (d) => mesSelecionado === "todos" || d.data.startsWith(mesSelecionado)
  );

  const resumo = resumirDespesas(despesasFiltradas, hojeISO());

  return (
    <>
      <div className="cabecalho">
        <div>
          <h2>A pagar</h2>
          <p className="sub">Mantenha os compromissos do negócio em dia.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select
            className="botao-claro"
            style={{ cursor: "pointer", fontWeight: 500 }}
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(e.target.value)}
          >
            {mesesDisponiveis.map((m) => (
              <option key={m} value={m}>
                {formatarMesAno(m)}
              </option>
            ))}
            <option value="todos">Todos os meses</option>
          </select>

          <button className="botao" onClick={() => setModalNova(true)}>
            + Nova despesa
          </button>
        </div>
      </div>

      {erro && <p className="erro-texto">{erro}</p>}

      <div className="cartao-resumo-pagar">
        <div>
          <small className="sub">
            {mesSelecionado === "todos" ? "Total a pagar em aberto" : "Total a pagar no mês"}
          </small>
          <div style={{ fontSize: "32px", fontWeight: 700, marginTop: "4px" }}>
            {moeda(resumo.total_em_aberto)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 600, fontSize: "15px" }}>
            {resumo.quantidade_em_aberto}{" "}
            {resumo.quantidade_em_aberto === 1
              ? "lançamento em aberto"
              : "lançamentos em aberto"}
          </div>
          {resumo.atrasadas.quantidade > 0 && (
            <div className="sub" style={{ marginTop: "4px", color: "var(--erro)" }}>
              {resumo.atrasadas.quantidade}{" "}
              {resumo.atrasadas.quantidade === 1
                ? "despesa atrasada"
                : "despesas atrasadas"}{" "}
              · {moeda(resumo.atrasadas.total)}
            </div>
          )}
        </div>
      </div>

      <div className="cartao">
        <table className="tabela">
          <thead>
            <tr>
              <th>Lançamento</th>
              <th>Vencimento</th>
              <th>Valor</th>
              <th>Situação</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {despesasFiltradas.map((d) => (
              <tr key={d.id}>
                <td>
                  <strong>{d.descricao}</strong>
                  <br />
                  <span className="sub">
                    {d.tipo === "projeto"
                      ? `${d.categoria ? d.categoria.charAt(0).toUpperCase() + d.categoria.slice(1) : "Projeto"} · ${d.projeto || "Projeto"}`
                      : "Despesa do negócio"}
                  </span>
                </td>
                <td>{dataCurta(d.data)}</td>
                <td>
                  <strong>{moeda(d.valor)}</strong>
                </td>
                <td>
                  <span
                    className={
                      "chip situacao " +
                      (d.paga ? "paga" : d.situacao === "atrasada" ? "atrasada" : "")
                    }
                  >
                    {d.paga
                      ? "Paga"
                      : d.situacao === "atrasada"
                      ? "Atrasado"
                      : "Em aberto"}
                  </span>
                </td>
                <td>
                  {!d.paga && (
                    <button
                      className="botao-claro botao-pequeno"
                      onClick={() => setBaixa(d)}
                    >
                      Dar baixa
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {despesasFiltradas.length === 0 && (
              <tr>
                <td colSpan="5" className="vazio">
                  Nenhum compromisso a pagar encontrado para este período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="sub" style={{ marginTop: "16px", fontSize: "13px" }}>
        As despesas vinculadas também aparecem dentro de cada projeto.
      </p>

      {modalNova && (
        <LancarDespesaFixaModal
          onFechar={() => setModalNova(false)}
          onSalvo={() => {
            setModalNova(false);
            setVersao((v) => v + 1);
          }}
        />
      )}

      {baixa && (
        <DarBaixaDespesaModal
          despesa={baixa}
          onFechar={() => setBaixa(null)}
          onSalvo={() => {
            setBaixa(null);
            setVersao((v) => v + 1);
          }}
        />
      )}
    </>
  );
}
