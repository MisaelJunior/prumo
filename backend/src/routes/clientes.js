import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
    try{
        const { rows } = await pool.query('SELECT id, nome FROM clientes ORDER BY nome');
        res.json(rows);
    } catch {
        res.status(500).json({ erro: 'Erro ao buscar clientes' });
    }
});

router.post('/', async (req, res) => {
    const { nome, telefone } = req.body;

    if(!nome || !String(nome).trim()) {
        return res.status(400).json({ erros: {nome: 'Nome é obrigatório' }}); 
    };

    try {
        const { rows } = await pool.query('INSERT INTO clientes (nome, telefone) VALUES ($1, $2) RETURNING *', [nome.trim(), telefone || null]);
        res.status(201).json(rows[0]);
    } catch {
        res.status(500).json({ erro: 'Erro ao salvar cliente' });
    }
});

export default router;