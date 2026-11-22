import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, salvarToken } from '../api.js';

export default function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function entrar(evento) {
    evento.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      const { token } = await api('/api/login', { method: 'POST', body: { usuario, senha } });
      salvarToken(token);
      navigate('/projetos');
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="login-pagina">
      <form className="login-cartao formulario" onSubmit={entrar}>
        <div>
          <h1 className="logo">prumo.</h1>
          <p className="sub">Finanças no prumo.</p>
        </div>
        <label>
          Usuário
          <input className="campo" autoComplete="username" value={usuario}
            onChange={(e) => setUsuario(e.target.value)} />
        </label>
        <label>
          Senha
          <input className="campo" type="password" autoComplete="current-password" value={senha}
            onChange={(e) => setSenha(e.target.value)} />
        </label>
        {erro && <span className="msg-erro">{erro}</span>}
        <button className="botao" type="submit" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}