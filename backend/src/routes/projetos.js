import { Router } from 'express';
import { pool } from '../db.js';
import { validarProjeto,validarParcelas } from '../validacoes.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT p.id, p.descricao, p.valor_fechado, p.prazo, p.status, c.nome AS cliente FROM projetos p JOIN clientes c ON p.cliente_id = c.id');
        res.json(rows);
    } catch{
        res.status(500).json({ erro: 'Erro ao buscar projetos' });
    }
});

router.post('/', async (req, res) => {
    const erros = validarProjeto(req.body);
    if (Object.keys(erros).length) return res.status(400).json({ erros });

    try{
        const { cliente_id, descricao, valor_fechado, prazo } = req.body;
        const { rows } = await pool.query('INSERT INTO projetos (cliente_id, descricao, valor_fechado, prazo) VALUES ($1, $2, $3, $4) RETURNING *', [cliente_id, descricao.trim(), valor_fechado, prazo || null]);
        res.status(201).json(rows[0]);
    } catch {
        res.status(500).json({ erro: 'Erro ao salvar projeto' });
    }
});

router.get('/:id', async(req, res) => {
    try{
        const{rows}= await pool.query(
            `SELECT p.id, p.descricao, p.valor_fechado, p.status, c.nome AS cliente FROM projetos p JOIN cliente c ON c.id =p.cliente_id WHERE p.id = $1`,
            [req.params.id]
        );
        if (!rows.length) return res.status(404).json({erro: 'Projeto não encontrado'});
        res.json(rows[0]);
    } catch {
        res.status(500),json({erro: 'Erro ao buscar projeto'});
    }
});

router.get('/:id/parcelas', async(req, res) => {
    try{
        const {rows} = await pool.query(
            `SELECT id, descricao, valor, valor_pago, to_char(vencimento, 'YYYY-MM-DD') AS vencimento FROM parcelas WHERE porjeto_id = $1 ORDER BY vencimento, id`,
            [req.params.id]
        );
        res.json(rows);
    } catch {
        res.status(500).json({erro: 'Erro ao listar parcelas'});
    }
});

router.post('/:id/parcelas', async(req, res) => {
    let conexao;
    try{
        const{rows} = await pool.query('SELECT valor_fechado FROM projetos WHERE id = $1', [req.params.id]);
        if (!rows.length) return res.status(404).json({erro: 'Projeto não encontrado'});

        const {parcelas}= req.body;
        const erros = validarParcelas(parcelas, rows[0].valor_fechado);
        if(Object.keys(erros).length) return res.status(400).json({erros});

        const jaTem =await pool.query(
            'SELECT 1 FROM parcelas WHERE projeto_id = $1 LIMIT 1', [req.params.id]
        );
        if(jaTem.rowCount){
            return res.status(409).json({erros: {geral: 'Este projeto ja tem parcelas lançadas'}});
        }

        conexao = await pool.connect();
        await conexao.query('BEGIN');
        for (const p of parcelas){
            await conexao.query(
                'INSERT INTO parcelas (projeto_id, descricao, valor, vencimento) VALUES ($1, $2, $3, $4)',
                [req.params.id, p.descricao || 'Parcela', p.valor, p.vencimento]
            );
        }
        await conexao.query('COMMIT');
        res.status(201).json({ok: true});
    }catch{
        if (conexao) await conexao.query('ROLLBACK').catch(() => {});
        res.status(500).json({erros: 'Erro ao salvar parcelas'});
    } finally{
        if(conexao) conexao.release();
    }
});

export default router;