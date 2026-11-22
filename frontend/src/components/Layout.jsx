import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { sairDaConta } from "../api.js";

const abas = [
  { rota: "/", emoji: "🏠", nome: "Painel" },
  { rota: "/projetos", emoji: "📁", nome: "Projetos" },
  { rota: "/receber", emoji: "💰", nome: "A receber" },
  { rota: "/pagar", emoji: "🧾", nome: "A pagar" },
  { rota: "/caixa", emoji: "📊", nome: "Fluxo de caixa" },
  { rota: "/relatorios", emoji: "📄", nome: "Relatórios" },
];

const hoje = new Date().toLocaleDateString("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function Layout() {
  const navigate = useNavigate();
  function sair() {
    sairDaConta();
    navigate("/login");
  }

  return (
    <div className="app">
      <aside className="lateral">
        <div>
          <h1 className="logo">Prumo.</h1>
          <p className="logo-sub">FINANÇAS PARA PROJETOS</p>
          <nav>
            {abas.map((a) => (
              <NavLink
                key={a.rota}
                to={a.rota}
                end={a.rota === "/"}
                className={({ isActive }) =>
                  "aba" + (isActive ? " ativa " : "")
                }
              >
                <span>{a.emoji}</span> {a.nome}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="usuario">
          <strong>Administrador</strong>
          <button className="link" onClick={sair}>
            Sair da conta
          </button>
        </div>
      </aside>
      <div className="conteudo">
        <header className="topo">
          <span>Seu negócio, em equilibrio.</span>
          <span>{hoje}</span>
        </header>
        <main className="pagina">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
