import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import clientesRouter from './routes/clientes.js';
import projetosRouter from './routes/projetos.js';
import parcelasRouter from './routes/parcelas.js';
import despesasRouter from './routes/despesas.js';
import loginRouter from './routes/login.js';
import {exigirLogin} from './exigirLogin.js';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json());
app.use('/api/clientes', exigirLogin, clientesRouter);
app.use('/api/projetos', exigirLogin, projetosRouter);
app.use('/api/parcelas', exigirLogin, parcelasRouter);
app.use('/api/despesas', exigirLogin, despesasRouter);
app.use('/api/login', loginRouter);

app.get('/api/saude', (req, res) => res.json({ status: 'ok' }));

app.get('/api/saude/db', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ db: 'ok' });
  } catch {
    res.status(500).json({ db: 'erro' });
  }
});

export default app;