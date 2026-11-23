import { Router } from 'express';
import { pool } from '../db.js';
import { validarDespesaFixa } from '../validacoes.js';
import { gerarVencimentosMensais, situacaoDespesa } from '../despesas.js';
import { hojeISO } from '../parcelas.js';

const router = Router();

// GET /api/despesas - Lista despesas para contas a pagar
router.get('/', async (req, res) => {
  try {
    const hoje = hojeISO();
    const { rows } = await pool.query(`
      SELECT d.id, d.tipo, d.projeto_id, d.categoria, d.descricao, d.valor, d.paga,
             to_char(d.data, 'YYYY-MM-DD') AS data,
             p.descricao AS projeto
      FROM despesas d
      LEFT JOIN projetos p ON d.projeto_id = p.id
      ORDER BY d.paga ASC, d.data ASC, d.id ASC
    `);

    const formatadas = rows.map((d) => ({
      ...d,
      situacao: situacaoDespesa(d, hoje),
    }));

    res.json(formatadas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar despesas' });
  }
});

// POST /api/despesas - Lança despesa fixa (sem projeto, com repetição opcional)
router.post('/', async (req, res) => {
  const erros = validarDespesaFixa(req.body);
  if (Object.keys(erros).length) return res.status(400).json({ erros });

  let conexao;
  try {
    const { descricao, valor, vencimento, repetir_meses, paga } = req.body;
    const meses = repetir_meses ? Number(repetir_meses) : 1;
    const datas = gerarVencimentosMensais(vencimento, meses);

    conexao = await pool.connect();
    await conexao.query('BEGIN');

    const inseridas = [];
    for (const data of datas) {
      const { rows } = await conexao.query(
        `INSERT INTO despesas (tipo, descricao, valor, data, paga)
         VALUES ('fixa', $1, $2, $3, $4)
         RETURNING id, tipo, projeto_id, categoria, descricao, valor, paga, to_char(data, 'YYYY-MM-DD') AS data`,
        [descricao.trim(), valor, data, paga === true]
      );
      inseridas.push(rows[0]);
    }

    await conexao.query('COMMIT');
    res.status(201).json(meses === 1 ? inseridas[0] : inseridas);
  } catch (err) {
    console.error(err);
    if (conexao) await conexao.query('ROLLBACK').catch(() => {});
    res.status(500).json({ erro: 'Erro ao salvar despesa fixa' });
  } finally {
    if (conexao) conexao.release();
  }
});

// PATCH /api/despesas/:id/pagar - Marca a despesa como paga
router.patch('/:id/pagar', async (req, res) => {
  if (!/^\d{1,9}$/.test(req.params.id)) {
    return res.status(404).json({ erro: 'Despesa não encontrada' });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE despesas
       SET paga = true
       WHERE id = $1
       RETURNING id, tipo, projeto_id, categoria, descricao, valor, paga, to_char(data, 'YYYY-MM-DD') AS data`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ erro: 'Despesa não encontrada' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao pagar despesa' });
  }
});

export default router;
