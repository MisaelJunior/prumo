import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import EmBreve from "./pages/EmBreve.jsx";
import Projetos from "./pages/Projetos.jsx";
import ProjetoDetalhe from "./pages/ProjetoDetalhe.jsx"
import AReceber from "./pages/AReceber.jsx";
import Login from "./pages/Login.jsx";
import RotaProtegida from "./components/RotaProtegida.jsx";

export default function App() {
  return(
    <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<RotaProtegida><Layout /></RotaProtegida>}>
        <Route path="/" element={<EmBreve titulo="Painel" />} />
        <Route path="/projetos" element={<Projetos />} />
        <Route path="/projetos/:id" element={<ProjetoDetalhe />} />
        <Route path="/receber" element={<AReceber />} />
        <Route path="/pagar" element={<EmBreve titulo="A pagar" />} />
        <Route path="/caixa" element={<EmBreve titulo="Fluxo de caixa" />} />
        <Route path="/relatorios" element={<EmBreve titulo="Relatorios" />} />
      </Route>
    </Routes>
  );
}