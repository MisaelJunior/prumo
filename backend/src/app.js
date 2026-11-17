import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import clientesRouter from './routes/clientes.js';
import projetosRouter from './routes/projetos.js';
import parcelasRouter from './routes/parcelas.js';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json());
app.use('/api/clientes', clientesRouter);
app.use('/api/projetos', projetosRouter);
app.use('/api/parcelas', parcelasRouter);

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