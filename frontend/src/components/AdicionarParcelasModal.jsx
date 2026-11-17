import { useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api.js';
import { moeda } from '../format.js';
import { gerarParcelas } from '../parcelas.js';

export default function AdicionarParcelasModal({ projeto, onFechar, onSalvo}){
    const [sinal, setSinal] = useState('');
    const [numero, setNumero] = useState('3');
    const [primeiro, setPrimeiro] = useState('');
    const [linhas, setLinhas] = useState([]);
    const [erros, setErros] = useState({});

    const total = Math.round(Number(projeto.valor_fechado) * 100);
    const soma = linhas.reduce((s, p) => s + (Math.round(Number(p.valor) * 100) || 0), 0);
    const confere = linhas.length > 0 && soma === total;

    function gerar(){
        const lista = gerarParcelas(projeto.valor_fechado, sinal, numero, primeiro);
        setLinhas(lista);
        setErros(lista.length ? {} : { geral: 'Confira o sinal, número de parcelas e o primeiro vencimento.'});
    }

    function editar(i, campo, valor){
        setLinhas(linhas.map((p,j) => (j===i ? {...p, [campo]: valor} : p)));
    }

    async function salvar(){
        try {
            await api(`/api/projetos/${projeto.id}/parcelas`, { method: 'POST', body: {parcelas: linhas}});
            onSalvo();
        } catch (err){
            const recebidos = err.erros ?? {};
            setErros(Object.keys(recebidos).length ? recebidos : { geral: 'Não foi possível salvar. Tente Novamente.'});
        }
    }
    return (
      <>
      <Modal titulo="Adicionar parcelas" onFechar={onFechar} largo>
        <div className="formulario">
          <p className="sub">Valor do projeto: <strong>{moeda(projeto.valor_fechado)}</strong></p>
          <label>
            Valor do sinal (opcional)
            <input className="campo" type="number" step="0.01" value={sinal} onChange={(e) => setSinal(e.target.value)} />
          </label>
          <label>
            Número de parcelas (do restante)
            <input className="campo" type="number" min="1" value={numero} onChange={(e) => setNumero(e.target.value)} />
          </label>
          <label>
            Primeiro vencimento
            <input className="campo" type="date" value={primeiro} onChange={(e) => setPrimeiro(e.target.value)} />
          </label>
          <button type="button" className="botao-claro" onClick={gerar}>Gerar parcelas</button>

          {linhas.length > 0 && (
            <>
              {linhas.map((p, i) => (
                <div className="linha-parcela" key={i}>
                  <span>{p.descricao}</span>
                  <input className="campo" type="number" step="0.01" value={p.valor}
                    onChange={(e) => editar(i, 'valor', e.target.value)} />
                  <input className="campo" type="date" value={p.vencimento}
                    onChange={(e) => editar(i, 'vencimento', e.target.value)} />
                </div>
              ))}
              <p className="resumo">Soma das parcelas: <strong>{moeda(soma / 100)}</strong></p>
              {confere
                ? <span className="ok">A soma bate com o valor do projeto</span>
                : <span className="msg-erro">A soma precisa ser igual ao valor do projeto</span>}
            </>
          )}

          {Object.values(erros).map((m) => <span className="msg-erro" key={m}>{m}</span>)}
          <div className="acoes">
            <button type="button" className="botao-claro" onClick={onFechar}>Cancelar</button>
            <button type="button" className="botao" onClick={salvar} disabled={!confere}>Salvar</button>
          </div>
        </div>
      </Modal>
      </>
    );
}