import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json());

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