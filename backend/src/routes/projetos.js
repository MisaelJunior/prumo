import { Router } from 'express';
import { pool } from '../db.js';
import { validarProjeto } from '../validacoes.js';

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

export default router;