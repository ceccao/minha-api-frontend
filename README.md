# minha-api-frontend

Frontend Angular da MinhaApi. Consome o backend (`minha-api-backend`) e depende do banco (`minha-api-database`) já migrado.

## Rodar

```bash
npm ci
npm start          # ng serve em http://localhost:4200, com proxy /api -> http://localhost:5014
```

Suba o backend antes (`dotnet run --project src/MinhaApi.Api --launch-profile http`, na raiz do backend). O proxy está em `src/proxy.conf.json`.

## Login

Toda rota (exceto `/login`) exige login. O primeiro usuário é criado pelo backend (`Seed:AdminEmail` e `Seed:AdminSenha` nos User Secrets). O token JWT fica em `sessionStorage` (some ao fechar a aba) e vai no cabeçalho `Authorization: Bearer` só nas chamadas para a própria API.

## Comandos

```bash
npm run build           # build de produção
npx ng test --watch=false   # testes (Vitest)
```

## Contrato com a API

Os modelos em `src/app/core/models` espelham os DTOs do backend. Ao mudar um DTO no backend, ajuste aqui no mesmo ticket.

## Estrutura

`core/` (auth, guards, interceptors, models) e `features/` (login, inicio). Cada tela nova vira uma pasta em `features/`. CI em `.github/workflows/ci.yml`.
