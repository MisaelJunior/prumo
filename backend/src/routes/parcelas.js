import { Router } from 'express';
import { pool } from '../db.js';
import { validarBaixa } from '../validacoes.js';
import { listarAtrasadas } from '../atrasos.js';
import { hojeISO } from '../parcelas.js';

const router = Router();

router.post('/:id/baixa', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT valor, valor_pago FROM parcelas WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ erro: 'Parcela não encontrada' });

    const erros = validarBaixa(rows[0], req.body.valor);
    if (Object.keys(erros).length) return res.status(400).json({ erros });

    const atualizada = await pool.query(
      `UPDATE parcelas SET valor_pago = valor_pago + $1::numeric
       WHERE id = $2 AND valor_pago + $1::numeric <= valor
       RETURNING id, valor, valor_pago`,
      [req.body.valor, req.params.id]
    );
    if (!atualizada.rowCount) {
      return res.status(409).json({ erros: { valor: 'O saldo da parcela mudou. Atualize a tela.' } });
    }
    res.json(atualizada.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao dar baixa' });
  }
});

router.get('/atrasadas', async (req, res) => {
  try {
      const hoje = hojeISO();
      const { rows } = await pool.query(
        `SELECT pa.id, pa.projeto_id, pa.descricao, pa.valor, pa.valor_pago, to_char(pa.vencimento, 'YYYY-MM-DD') AS vencimento, c.nome AS cliente, p.descricao AS projeto FROM parcelas pa JOIN projetos p ON pa.projeto_id = p.id JOIN clientes c ON p.cliente_id = c.id WHERE pa.valor_pago < pa.valor AND pa.vencimento < $1`,
        [hoje]
      );
      res.json(listarAtrasadas(rows, hoje));
  } catch(err) {
    console.error(err);
    res.status(500).json({erro: 'Erro ao listar parcelas atrasadas'});
  }
});

export default router;