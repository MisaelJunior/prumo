CREATE TABLE despesas (
    id SERIAL PRIMARY KEY,
    tipo TEXT NOT NULL CHECK (tipo IN ('projeto', 'fixa')),
    projeto_id INTEGER REFERENCES projetos(id) ON DELETE CASCADE,
    categoria TEXT CHECK (categoria IN ('material', 'frete', 'terceirizado', 'outros')),
    descricao TEXT NOT NULL,
    valor NUMERIC(12,2) NOT NULL CHECK (valor > 0),
    data DATE NOT NULL,
    paga BOOLEAN NOT NULL DEFAULT false,
    criada_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK(
        (tipo = 'projeto' AND projeto_id IS NOT NULL) OR
        (tipo = 'fixa' AND projeto_id IS NULL)
    )
);

CREATE INDEX despesas_projeto_idx ON despesas (projeto_id);
    