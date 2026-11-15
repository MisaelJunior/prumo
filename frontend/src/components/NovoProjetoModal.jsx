import {useEffect, useState} from 'react';
import Modal from './Modal.jsx';
import {api} from '../api.js';

export default function NovoProjetoModal({onFechar, onSalvo}){
    const [clientes, setClientes] = useState([]);
    const [form, setForm] = useState({ client_id: '', descricao: '', valor_fechado: '', prazo: ''});
    const [cli, setCli] = useState({nome:'', telefone:''});
    const [novoCliente, setNovoCliente] = useState(false);
    const [erros, setErros] = useState({});

    useEffect(() => {
        api('/api/clientes').then(setClientes).catch(()=>{});
    }, []);

    const mudar = (campo) => (e) => setForm({...form, [campo]: e.target.value});
    const classe = (campo) => 'campo' + (erros[campo] ? ' erro' : '');

    async function adicionarCliente() {
        try{
            const novo = await api('/api/clientes', {method: 'POST', body: cli});
            setClientes([...clientes, novo]);
            setForm({...form, cliente_id: String(novo.id)});
            setCli({nome:'', telefone:''});
            setNovoCliente(false);
            setErros({});
        } catch (err){
            setErros({nome: err.erros?.nome ?? 'Não foi possível salvar o cliente.'});
        }
    }

    async function salvar(e){
        e.preventDefault();
        try{
            await api('/api/projetos', {method: 'POST', body: form});
            onSalvo();
        } catch (err){
            const recebidos = err.erros ?? {};
            setErros(Object.keys(recebidos).length ? recebidos : {geral: 'Não foi possível salvar. Tente novamente.'});
        }
    }

    return(
        <Modal titulo="Novo Projeto" onFechar={onFechar}>
            <form className='formulario' onSubmit={salvar} noValidate>
                <label>
                    Cliente
                    <select className={classe('cliente_id')} value={form.cliente_id} onChange={mudar('cliente_id')}>
                        <option value="">Selecione...</option>
                        {clientes.map((c) =>(
                            <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                    </select>
                    {erros.cliente_id && <span className='msg-erro'>{erros.cliente_id}</span>}
                </label>

                <button type='button' className='link' onClick={() => setNovoCliente(!novoCliente)}>
                    + Novo cliente
                </button>
                {novoCliente && (
                    <div className='caixa-cliente'>
                        <input className={classe('nome')} placeholder='Nome do Cliente' value={cli.nome} onChange={(e)=> setCli({...cli, nome: e.target.value })} />
                        {erros.nome && <span className='msg-erro'>{erros.nome}</span>}
                        <input className={classe('campo')} placeholder='Telefone (opcional)' value={cli.telefone} onChange={(e)=> setCli({...cli, telefone: e.target.value })} />
                        <button type='button' className='botao-claro' onClick={adicionarCliente}>Adicionar cliente</button>
                    </div>
                )}

                <label>
                    Descrição
                    <input className={classe('descricao')} placeholder='Ex.: Cozinha planejada' value={form.descricao} onChange={mudar('descricao')}/>
                    {erros.descricao && <span className='msg-erro'>{erros.descricao}</span>}
                </label>

                <label>
                    Valor fechado (R$)
                    <input className={classe('valor_fechado')} type='number' step='0.01' value={form.descricao} onChange={mudar('valor_fechado')}/>
                    {erros.valor_fechado && <span className='msg-erro'>{erros.valor_fechado}</span>}
                </label>

                <label>
                    Prazo de entrega (opcional)
                    <input className='campo' type='date' value={form.prazo} onChange={mudar('prazo')}/>
                </label>

                {erros.geral && <span className='msg-erro'>{erros.geral}</span>}
                <div className='acoes'>
                    <button type='button' className='botao-claro' onClick={onFechar}>Cancelar</button>
                    <button type='submit' className='botao'>Salvar</button>
                </div>
            </form>
        </Modal>
    );
}