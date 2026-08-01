# Central de Afiliados & Guia de Integrações — Affiliate Autopilot

## Visão Geral
A Central de Afiliados permite cadastrar, gerenciar e auditar contas de parceiros em diversas plataformas de afiliados de maneira isolada, segura e extensível.

---

## 1. Plataformas Suportadas (Módulo 2)

### A. Mercado Livre (`mercado-livre`)
- **Status**: `available_for_configuration`
- **Capability**: `MANUAL_LINK_GENERATION`
- **Comportamento**: Devido à ausência de API pública aberta de afiliados para scraping sem permissão, o sistema opera no modo manual oficial. O operador gera os links de afiliados nas ferramentas oficiais do Mercado Livre e cola a URL para rastreamento e divulgação.
- **Segurança**: Sem scraping, sem automação de login e sem violação dos Termos de Uso do Mercado Livre.

### B. Amazon Brasil (`amazon-brasil`)
- **Status**: `ACTIVE`
- **Capability**: `Amazon Creators API` (com suporte a busca de produtos, detalhamento de ASIN e geração de links).
- **Serviços Dedicados**:
  - `AmazonAuthService`: Gerencia autenticação OAuth2 client credentials e cache de tokens de acesso.
  - `AmazonCreatorsApiClient`: Realiza chamadas HTTP autenticadas com controle de timeout e retry.
- **Variáveis de Ambiente**:
  - `AMAZON_CREDENTIAL_ID`
  - `AMAZON_CREDENTIAL_SECRET`
  - `AMAZON_PARTNER_TAG`
  - `AMAZON_MARKETPLACE` (Padrão: `amazon.com.br`)

---

## 2. Abóboda de Credenciais Seguras (`CredentialVault`)

Todas as API Keys, Client Secrets e tokens privados são armazenados na classe `CredentialVault` ([services/affiliate/CredentialVault.ts](file:///c:/Users/Thiago%20Thomaz/OneDrive/Documentos/AntiGravity%20-%20Projetos/Renda%20Afiliados/services/affiliate/CredentialVault.ts)):
- **Algoritmo**: Criptografia simétrica `AES-256-GCM`.
- **Proteção**: Segredos jamais são retornados para o frontend. A API expõe unicamente flags booleanas (`credentialsConfigured: true`).

---

## 3. Modo de Simulação (`AFFILIATE_MOCK_MODE=true`)

Para desenvolvimento e testes sem consumir a cota de APIs reais da Amazon:
- Defina `AFFILIATE_MOCK_MODE=true` no arquivo `.env`.
- Todos os adapters simulam retornos realistas de produtos normalizados com a Partner Tag configurada.
