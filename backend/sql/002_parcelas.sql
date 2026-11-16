CREATE TABLE parcelas (
  id SERIAL PRIMARY KEY,
  projeto_id INTEGER NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  valor NUMERIC(12,2) NOT NULL CHECK (valor > 0),
  vencimento DATE NOT NULL,
  valor_pago NUMERIC(12,2) NOT NULL DEFAULT 0,
  criada_em TIMESTAMPTZ NOT NULL DEFAULT now()
);