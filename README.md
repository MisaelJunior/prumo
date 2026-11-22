# prumo.

**Finanças no prumo.** Sistema web de controle financeiro para pequenos negócios que vendem por projeto.

O Prumo reúne recebimentos, despesas e lucro de cada projeto em um só lugar, para o administrador saber quanto falta receber, quanto precisa pagar e quanto cada trabalho realmente deu de lucro.

> Projeto M2 da disciplina de Métodos Ágeis, Engenharia de Software, UMC, 2026/02.

**Projeto no ar:** https://prumo-1.onrender.com

> O projeto roda em planos gratuitos. Um monitor externo consulta a rota `/api/saude` da API periodicamente para evitar que ela "durma". Se o monitor estiver parado, o primeiro carregamento pode levar cerca de um minuto.

## O problema

Pequenos negócios que vendem sob encomenda costumam controlar o dinheiro em caderno ou planilha e não sabem quanto falta receber, quanto precisam pagar nem quanto lucram em cada trabalho.

## Funcionalidades

- [x] Cadastro de clientes e de projetos (com valor fechado)
- [x] Lançamento de sinal e parcelas de cada projeto, com conferência da soma
- [x] Baixa total ou parcial de parcelas
- [x] Login com usuário e senha
- [x] Parcelas atrasadas
- [ ] Despesas de projeto e despesas fixas
- [ ] Lucro por projeto
- [ ] Painel com total a receber, total a pagar e saldo previsto
- [ ] Fluxo de caixa mensal
- [ ] Exportação do resultado do mês em PDF
- [ ] Notificações por e-mail

## Tecnologias

| Parte | Tecnologia |
|---|---|
| Front-end | React com Vite |
| Back-end | Node.js com Express |
| Banco de dados | PostgreSQL (Neon) |
| Login | bcryptjs e JWT |
| Testes | Vitest e Supertest |
| Integração e deploy | GitHub Actions e Render |
| Design | Figma |
| Notificações | Brevo |

## Estrutura do repositório

```
prumo/
  backend/
    scripts/        scripts auxiliares (criar o usuário administrador)
    sql/            arquivos SQL do banco, em ordem de execução
    src/
      routes/       rotas da API
      tests/        testes automáticos
  frontend/
    src/
      components/   componentes reutilizáveis
      pages/        telas
  .github/workflows/  pipeline de testes (CI) e de deploy
```

## Como rodar localmente

### Pré-requisitos

- Node.js 22 (ou 20 ou superior)
- Git
- Um banco PostgreSQL (o projeto usa o [Neon](https://neon.com), que tem plano gratuito)

### 1. Clonar e instalar

```bash
git clone https://github.com/SEU-USUARIO/prumo.git
cd prumo/backend
npm install
cd ../frontend
npm install
```

### 2. Configurar as variáveis de ambiente do back-end

Em `backend/`, copie o arquivo de exemplo e preencha:

```bash
cp .env.example .env      # no Windows (PowerShell): copy .env.example .env
```

| Variável | Para que serve |
|---|---|
| `DATABASE_URL` | String de conexão do PostgreSQL |
| `FRONTEND_URL` | Endereço do front-end (local: `http://localhost:5173`), usado no CORS |
| `JWT_SECRET` | Segredo que assina os tokens de login (uma string longa e aleatória) |

Para gerar um segredo:

```bash
node -p "require('crypto').randomBytes(32).toString('hex')"
```

No front-end publicado, a variável `VITE_API_URL` aponta para o endereço da API. Em desenvolvimento ela não é necessária, porque o Vite redireciona `/api` para `http://localhost:3001`.

### 3. Criar as tabelas

No SQL Editor do seu banco, execute os arquivos de `backend/sql/` em ordem:

1. `001_inicial.sql`
2. `002_parcelas.sql`
3. `003_despesas.sql`
4. `004_usuarios.sql`

### 4. Criar o usuário administrador

A senha é informada só no terminal, nunca em arquivo:

```powershell
# PowerShell
$env:ADMIN_USER="admin"
$env:ADMIN_PASSWORD="uma-senha-forte"
node scripts/criar-usuario.js
Remove-Item Env:ADMIN_PASSWORD
```

```bash
# Git Bash, Mac ou Linux
ADMIN_USER=admin ADMIN_PASSWORD="uma-senha-forte" node scripts/criar-usuario.js
```

### 5. Executar

Em dois terminais:

```bash
# Terminal 1: API (http://localhost:3001)
cd backend
npm run dev
```

```bash
# Terminal 2: site (http://localhost:5173)
cd frontend
npm run dev
```

## Testes

```bash
cd backend
npm test            # testes automáticos da API

cd ../frontend
npm run build       # confere se o front compila
```

Os mesmos comandos rodam no GitHub Actions a cada envio de código.

## Entrega e deploy

- **Integração contínua:** a cada push, o GitHub Actions instala as dependências, roda os testes do back-end e compila o front-end.
- **Nível de entrega: Entrega Contínua.** O código fica pronto para publicar, e o deploy em produção é disparado pelo time ao fim de cada Sprint, depois da Review (aba **Actions > Deploy > Run workflow**).
- **Hospedagem:** Render (API e site) e Neon (banco de dados). Os endereços de deploy ficam em segredos do GitHub, nunca no código.

## Como o time trabalha

- Metodologia Scrum, com 3 Sprints de uma semana e quadro Kanban com limite de WIP.
- Cada história vira uma branch, como `feat/us02-cadastrar-projeto`.
- Nada entra na `main` sem Pull Request revisado pelo time e com o CI verde.
- Commits no formato `US02: o que mudou`.
- Práticas de XP usadas: TDD (teste antes do código nas regras de negócio) e Integração Contínua.
- Board: https://trello.com/invite/b/6af29243893bcabda3eebce8/ATTI6694ebc78fc2db150c624229a1ec21de6B01D270/prumo

## Segurança

- Nenhuma senha, chave ou string de conexão é versionada: o arquivo `.env` está no `.gitignore`.
- Todos os dados de teste e de demonstração são fictícios.
- As senhas dos usuários são guardadas como hash (bcrypt), e o acesso à API é protegido por token JWT.

## Uso de IA

O projeto é desenvolvido com apoio de ferramentas de IA, conforme as regras do Projeto M2. O código gerado passa pela mesma revisão e pelos mesmos testes do restante, e o uso significativo é registrado no Relatório do Projeto.

## Equipe

- Misael da Silva Santos Junior
- Guilherme Domingues de Paula
- Diego Miranda Nascimento
