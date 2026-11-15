import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import EmBreve from "./pages/EmBreve.jsx";
// import Projetos from "./pages/Projetos.jsx";

export default function App() {
  return(
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<EmBreve titulo="Painel" />} />
        <Route path="/projetos" element={<EmBreve titulo="Projetos" />} />
        <Route path="/receber" element={<EmBreve titulo="A receber" />} />
        <Route path="/pagar" element={<EmBreve titulo="A pagar" />} />
        <Route path="/caixa" element={<EmBreve titulo="Fluxo de caixa" />} />
        <Route path="/relatorios" element={<EmBreve titulo="Relatorios" />} />
      </Route>
    </Routes>
  );
}