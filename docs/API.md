# Documentação da API REST — Affiliate Autopilot

## Endpoints da Central de Afiliados

### 1. Plataformas
- `GET /api/affiliate-platforms`: Lista todas as plataformas de afiliados cadastradas e suas capabilities.
- `GET /api/affiliate-platforms/:id`: Detalha uma plataforma específica.

### 2. Contas de Afiliados
- `GET /api/affiliate-accounts`: Lista contas de afiliados com resumo seguro de credenciais.
- `GET /api/affiliate-accounts/:id`: Detalha uma conta.
- `POST /api/affiliate-accounts`: Cadastra nova conta com credenciais criptografadas via `CredentialVault`.
- `PATCH /api/affiliate-accounts/:id`: Atualiza dados ou credenciais.
- `DELETE /api/affiliate-accounts/:id`: Exclui uma conta.
- `POST /api/affiliate-accounts/:id/test`: Executa teste de conexão e atualiza o status.
- `GET /api/affiliate-accounts/:id/capabilities`: Retorna as capabilities da conta.

### 3. Operações de Produtos por Conta
- `POST /api/affiliate-accounts/:id/products/search`: Busca produtos na plataforma e os salva normalizados.
- `POST /api/affiliate-accounts/:id/products/:externalId`: Busca e normaliza um produto por ID externo / ASIN.
