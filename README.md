# Finflow — Controle Financeiro Pessoal

Documentação principal do projeto.

Sumário

- Visão Geral
- Funcionalidades
- Stack Técnica
- Arquitetura e Organização de Pastas
- Fluxos de Negócio e Módulos
- Estado Global e Hooks
- Componentes Compartilhados (Design System)
- Validações, Utilitários e Datas
- Gráficos e Métricas
- Padrões de Código e Qualidade
- Como Rodar o Projeto (Dev, Build, Preview)
- Variáveis de Ambiente
- Scripts NPM
- Boas Práticas de Desenvolvimento
- Testes (Estratégia e Sugestão de Setup)
- Build e Deploy (Vite)
- Acessibilidade e i18n
- Segurança
- Troubleshooting
- Roadmap
- Guia de Contribuição
- Licença

Visão Geral
Finflow é uma aplicação web para controle financeiro pessoal, com foco em simplicidade, visualização de métricas, e fluxo de autenticação. O objetivo é permitir que o usuário registre entradas (salário) e saídas (transações), visualize gráficos e acompanhe a saúde financeira.

Status: Em desenvolvimento.

Funcionalidades

- Autenticação: login, registro e reset de senha (UI e fluxo de estados).
- Registro de Salário e Transações (entradas/saídas).
- Painel com métricas, cartões de indicadores e gráficos (Recharts):
  - Visão geral financeira
  - Gráfico de despesas com tooltip customizado e legenda
  - Transações recentes
- Notificações (toasts) e feedbacks de UI.
- Rotas protegidas baseadas no estado de autenticação.

Stack Técnica

- Linguagem: TypeScript
- Framework: React + Vite
- Router: React Router (implícito via ProtectedRoute e app.tsx)
- Estado: Zustand (stores em src/modules/\*\*/store e src/shared/store)
- UI: Componentes próprios e utilitários (src/shared/components/ui)
- Gráficos: Recharts
- Datas: dayjs com configuração customizada (src/shared/lib/dayjs-config.ts)
- Estilo: CSS (index.css) e componentes estilizados
- Qualidade: ESLint (eslint.config.js)

Arquitetura e Organização de Pastas
Estrutura principal (src/):

- app.tsx: composição raiz de rotas e layout.
- main.tsx: bootstrap da aplicação (React + Vite).
- index.css: estilos globais.
- modules/
  - auth/
    - components/: páginas e formulários de autenticação (AuthPage, LoginForm, RegisterForm, ResetPasswordForm)
    - store/: Zustand store e actions (authStore, useAuthActions)
    - types/: tipos relacionados a auth
  - dashboard/
    - components/: widgets da dashboard (ExpenseChart, MetricsCards, RecentTransactions, etc.)
    - constants/: constantes de UI e domínio
    - hooks/: hooks específicos de dashboard (estatísticas e dados de gráfico)
    - types/: tipos de dashboard
    - utils/: utilitários específicos (cálculos, cores)
- shared/
  - components/: componentes reutilizáveis (Header, Footer, Loading, ProtectedRoute, toasts e UI de base como button/card/alert)
  - hooks/: hooks genéricos (scroll, toasts, dados financeiros)
  - lib/: utilitários de baixo nível (dayjs-config, utils, validations, toast-event)
  - store/: estado global financeiro (financialStore, useFinancialActions)
  - types/: tipos globais (finance e recharts)

Padrões adotados:

- MFE por domínio lógico em modules/, compartilhando base em shared/.
- Stores e hooks acoplados por feature, com boundary claro entre shared e modules.
- Tipos (types/) por domínio para reduzir acoplamento e favorecer intellisense.

Fluxos de Negócio e Módulos

1. Autenticação (src/modules/auth)

- AuthPage orquestra formulários (LoginForm, RegisterForm, ResetPasswordForm).
- authStore mantém user/session/token; useAuthActions expõe ações (login/logout/register/reset).
- ProtectedRoute (shared/components/ProtectedRoute.tsx) garante acesso a rotas autenticadas.

2. Dashboard (src/modules/dashboard)

- Dashboard.tsx compõe visão geral com:
  - MetricsCards.tsx: KPIs como total de despesas/receitas e saldo.
  - FinancialOverview.tsx: resumos e agregações.
  - ExpenseChart/: gráfico de despesas (Recharts) com tooltips customizados.
  - RecentTransactions.tsx: lista últimas transações.
  - TransactionForm.tsx e SalaryForm.tsx: entrada de dados.
- hooks/useStatistics.ts e hooks/useChartData.ts: transformação de dados para UI.
- utils/calculatePercentage.ts, utils/getColorForIndex.ts: cálculos e estética.

3. Shared

- store/financialStore.ts: fonte única de verdade para dados financeiros (transações, salário) + actions em useFinancialActions.
- hooks/useFinancialData.ts: seletor e agregações reativas.
- lib/validations.ts: validações de formulário (ex.: números positivos, required, datas válidas).
- components/toast: Notification + ToastNotification integrados com hooks e eventos (lib/toast-event.ts).

Estado Global e Hooks

- Zustand stores por domínio:
  - Auth: src/modules/auth/store/authStore.ts
  - Financeiro: src/shared/store/financialStore.ts
- Ações separadas em hooks (useAuthActions, useFinancialActions) para encapsular side-effects e garantir API estável.
- Hooks utilitários: useToast, useScrollVisibility, useSmoothScroll, useFinancialData.

Boas práticas com estado:

- Manter shape plano, normalizar transações quando necessário.
- Derivar dados via selectors e hooks (ex.: useStatistics) para minimizar re-renderizações.
- Evitar lógica complexa dentro de componentes; preferir hooks e utils.

Componentes Compartilhados (Design System)

- UI base em shared/components/ui: button.tsx, card.tsx, alert-dialog.tsx.
- Componentes de layout e infra: Header, Footer, Loading, ProtectedRoute, ScrollToTopButton, Logo.
- Notificações: Notification + ToastNotification com eventos e hook useToast.

Diretrizes de uso:

- Compor páginas com componentes de domain (modules) e UI base (shared/ui).
- Reutilizar padronizações de cor/tipografia do index.css.

Validações, Utilitários e Datas

- Validações centralizadas em shared/lib/validations.ts.
- Utils gerais em shared/lib/utils.ts.
- Datas com dayjs usando shared/lib/dayjs-config.ts (plugins/locale conforme necessário).

Gráficos e Métricas

- Biblioteca: Recharts.
- Componentes: src/modules/dashboard/components/ExpenseChart/\* (CustomTooltip, BarTooltip, renderLegend, index.tsx).
- Tipos: shared/types/recharts.ts e modules/dashboard/types.
- Paleta: utils/getColorForIndex.ts para cores consistentes.

Padrões de Código e Qualidade

- TypeScript estrito quando viável, visando segurança de tipos.
- ESLint com regras definidas em eslint.config.js.
- Componentes funcionais com hooks; evitar classes.
- Pastas por feature, arquivos pequenos e coesos.
- Nomes semânticos; evitar abreviações obscuras.
- Import paths relativos a partir de src/ (recomendado configurar paths no tsconfig.app.json se necessário).

Commits e mensagens:

- Mensagens curtas e descritivas (ex.: feat, fix, refactor, docs, chore).

Como Rodar o Projeto
Pré-requisitos:

- Node.js LTS (>= 18)
- npm ou pnpm (o projeto usa npm no package.json)

Instalação:

1. Instalar dependências
   npm install

2. Desenvolvimento (ambiente local com HMR)
   npm run dev

   - Vite iniciará o servidor (default: http://localhost:3000)

3. Build de produção
   npm run build

4. Preview do build
   npm run preview
   - Sobe um servidor que serve o build gerado dist/

Variáveis de Ambiente

- Por padrão, Vite expõe variáveis começando com VITE\_. Crie um arquivo .env.local (não commitado) quando necessário.
  Sugestões:
- VITE_API_BASE_URL: endpoint de API de autenticação/dados (se aplicável).
- VITE_APP_NAME: nome exibido na UI.

Crie o arquivo na raiz:
.env.local
VITE_API_BASE_URL=https://api.seu-dominio.com
VITE_APP_NAME=Finflow

Consumo no código:
const baseUrl = import.meta.env.VITE_API_BASE_URL

Scripts NPM

- dev: inicia o servidor de desenvolvimento do Vite.
- build: gera a build de produção.
- preview: serve a build de produção para validação local.

Ver todos os scripts:
cat package.json

Boas Práticas de Desenvolvimento

- Separar lógica de UI (componentes) da lógica de domínio (hooks/stores/utils).
- Tipar todas as props e retornos relevantes.
- Evitar estados duplicados entre componentes e stores; derivar quando possível.
- Tratar erros de rede com toasts e estados de loading (Loading.tsx).
- Manter consistência visual via shared/components/ui e tokens de cor.
- Componentes de gráfico devem ser resilientes a dados vazios.

Testes (Estratégia e Sugestão de Setup)
Status atual: não há pasta de testes no repositório.
Sugestão de stack:

- Unit e hooks: Vitest + React Testing Library.
- Componentes: Testing Library + jest-dom matchers.
- e2e: Playwright ou Cypress.

Exemplo de setup mínimo (sugestão):

- Instalar dependências:
  npm i -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
- Adicionar script em package.json:
  "test": "vitest"
- Criar setupTests.ts com:
  import '@testing-library/jest-dom'
- Configurar vitest em vite.config.ts (test: { environment: 'jsdom', setupFiles: './src/setupTests.ts' })

Cobertura recomendada:

- Stores (authStore, financialStore) e hooks (useAuthActions, useFinancialActions, useStatistics).
- Componentes críticos (TransactionForm, SalaryForm, ExpenseChart).

Build e Deploy (Vite)

- Build: npm run build gera dist/ otimizado.
- Preview: npm run preview valida o artefato localmente.
- Deploy estático: servir dist/ em CDN/hosting estático (Netlify, Vercel, GitHub Pages com adaptações).
- Se houver backend: configurar VITE_API_BASE_URL e CORS.

Cache e performance:

- Import dinâmico para telas pesadas se necessário.
- Memoização de dados derivados em hooks.

Acessibilidade e i18n

- Acessibilidade: usar semântica HTML, labels para inputs, aria-\* nos componentes interativos e foco visível.
- Internacionalização: atualmente conteúdo em PT-BR. Se necessário, adotar i18n (ex.: i18next) e extrair strings.

Segurança

- Nunca expor segredos no front-end.
- Validar inputs com shared/lib/validations.ts.
- Proteger rotas com ProtectedRoute.
- Tratar tokens via store de auth (preferir armazenamento seguro, revogação e expiração se integrado a backend).

Troubleshooting

- Porta ocupada ao rodar dev: alterar porta no vite.config.ts ou usar env VITE_PORT.
- Tipos faltando: rodar npm install e checar tsconfig.\*.json.
- Erros com Recharts: verificar dados undefined/[] e tipos em shared/types/recharts.ts.
- Datas inválidas: garantir formato compatível com dayjs-config.
- Toasts não exibem: checar inicialização de ToastNotification e uso do hook useToast.

Roadmap

- Integração com backend real para persistência e autenticação JWT/OAuth.
- Exportação/Importação de transações (CSV/Excel).
- Metas orçamentárias por categoria.
- Filtros e busca avançada nas transações.
- Dark mode e tema customizável.
- Testes automatizados (unit, e2e) e pipeline CI.

Guia de Contribuição

- Crie branch a partir de main: feat/xxx, fix/yyy, chore/zzz.
- Padronize commits: feat, fix, refactor, chore, docs, test.
- Execute lint antes de abrir PR: npx eslint .
- Garanta que o projeto builda: npm run build.
- Abra PR com descrição clara do problema/solução.

Licença
Defina a licença desejada (ex.: MIT). Se for MIT, adicione um arquivo LICENSE na raiz do projeto e referencie aqui.
