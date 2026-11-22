const API = import.meta.env.VITE_API_URL ?? '';
const CHAVE = 'prumo_token';

export const pegarToken = () => localStorage.getItem(CHAVE);
export const salvarToken = (token) => localStorage.setItem(CHAVE, token);
export const sairDaConta = () => localStorage.removeItem(CHAVE);

export async function api(caminho, opcoes = {}) {
  const token = pegarToken();
  const resposta = await fetch(`${API}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: opcoes.body ? JSON.stringify(opcoes.body) : undefined,
  });
  const dados = await resposta.json().catch(() => null);

  if (resposta.status === 401 && caminho !== '/api/login') {
    sairDaConta();
    window.location.hash = '/login';
  }
  if (!resposta.ok) {
    const erro = new Error(dados?.erro ?? 'Erro na requisição');
    erro.erros = dados?.erros ?? {};
    throw erro;
  }
  return dados;
}