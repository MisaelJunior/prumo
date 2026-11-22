import 'dotenv/config';
import bcrypt from 'bcryptjs';
import {pool} from '../src/db.js';

const usuario = process.env.ADMIN_USER;
const senha = process.env.ADMIN_PASSWORD;

if (!usuario || !senha) {
  console.error('Defina ADMIN_USER e ADMIN_PASSWORD antes de rodar.');
  process.exit(1);
}
if (senha.length < 8) {
  console.error('A senha precisa ter pelo menos 8 caracteres.');
  process.exit(1);
}

try {
  const hash = await bcrypt.hash(senha, 10);
  await pool.query('INSERT INTO usuarios (usuario, senha_hash) VALUES ($1, $2)', [usuario, hash]);
  console.log(`Usuário "${usuario}" criado.`);
} catch (err) {
  console.error(err.code === '23505' ? 'Esse usuário já existe.' : err.message);
} finally {
  await pool.end();
}