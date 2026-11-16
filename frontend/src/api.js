const API = import.meta.env.VITE_API_URL ?? '';

export async function api(caminho, opcoes = {}) {
    const resposta = await fetch(`${API}${caminho}`, {
        headers: {'Content-Type': 'application/json'},
        ...opcoes,
        body: opcoes.body ? JSON.stringify(opcoes.body) : undefined,
    });

    const dados = await resposta.json().catch(() => null);

    if(!resposta.ok){
        const erro = new Error('Erro na requisição');
        erro.erros = dados?.erros ?? {};
        throw erro;
    }
    return dados;
}