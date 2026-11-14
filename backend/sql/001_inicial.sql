/* ============================
 * Script de criação do banco
 * ============================
 *
 * Este script cria as tabelas iniciais do banco de dados.
 * Ele deve ser executado apenas uma vez,
 * para o time recriar o banco 
*/

CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE projetos (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id),
  descricao TEXT NOT NULL,
  valor_fechado NUMERIC(12,2) NOT NULL CHECK (valor_fechado > 0),
  prazo DATE,
  status TEXT NOT NULL DEFAULT 'aprovado',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);