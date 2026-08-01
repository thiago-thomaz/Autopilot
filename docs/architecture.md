# Affiliate Autopilot — Arquitetura da Plataforma (Módulo 1)

## Visão Geral
O **Affiliate Autopilot** foi desenhado como um ecossistema modular, seguro e escalável de automação de afiliados.
No **Módulo 1**, foi estabelecida toda a fundação técnica da aplicação sem efetuar chamadas a integrações externas ativas.

---

## 1. Stack e Tecnologias
- **Framework Web**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript (Strict Mode)
- **Interface**: React, Tailwind CSS, Lucide React (Ícones)
- **Banco de Dados**: PostgreSQL com ORM Prisma
- **Validação**: Zod
- **Segurança**: Bcryptjs para criptografia de senhas e mascaramento de segredos de credenciais
- **Testes**: Vitest (Unitários) e Playwright (E2E preparados)
- **Automação Externa**: Preparado para webhooks do n8n com autenticação por token de API (`x-n8n-api-key`)

---

## 2. Estrutura de Pastas

```
/app
  /api
    /n8n/events      -> Endpoint de recepção de eventos externos do n8n
    /settings        -> Endpoint de leitura e atualização de configurações gerais
  /configuracoes     -> Tela de configurações do sistema
  /produtos          -> Módulo reservado para produtos descobertos
  /ofertas           -> Módulo reservado para análise de oportunidade
  /conteudos         -> Módulo reservado para criação de anúncios com IA
  ...
/components          -> Componentes de UI (Sidebar, Navbar, Skeletons, EmptyStates, etc.)
/config              -> Parâmetros default (ENABLE_AUTOMATION=false, MANUAL)
/docs                -> Documentação técnica da arquitetura
/lib                 -> Utilitários (Prisma, Logger, Security)
/prisma              -> Schema de banco de dados relacional com 16 entidades e enums
/repositories        -> Abstrações para acesso a dados (SystemLog, Settings)
/schemas             -> Schemas Zod para validação rigorosa
/services            -> Serviços de domínio (affiliate, products, content, compliance, etc.)
/tests               -> Testes unitários e de integração
/types               -> Definições de tipos e interfaces globais
```

---

## 3. Modelo de Dados (Prisma Schema)

O banco de dados PostgreSQL conta com 16 entidades principais e Enums fortemente tipados:

1. **User**: Usuários administradores/operadores.
2. **AffiliatePlatform**: Cadastro de programas parceiros (Hotmart, Shopee, Amazon, etc.).
3. **AffiliateAccount**: Credenciais do operador em cada plataforma (criptografadas/mascaradas no frontend).
4. **Product**: Produtos monitorados e enriquecidos.
5. **Campaign**: Campanhas promocionais.
6. **Content**: Peças publicitárias geradas para divulgação.
7. **Channel**: Canais de transmissão (Telegram, WhatsApp, etc.).
8. **Publication**: Histórico de mensagens agendadas e enviadas.
9. **ClickEvent**: Registro de cliques e rastreamento de links.
10. **Conversion**: Compras confirmadas via relatórios/webhooks de afiliados.
11. **Commission**: Valores de comissões gerados por conversão.
12. **AutomationJob**: Filas de tarefas de varredura assíncronas.
13. **SystemLog**: Auditoria e rastreabilidade de eventos do sistema.
14. **ComplianceRule**: Regras de conformidade das plataformas e termos de uso.
15. **ComplianceCheck**: Validações aplicadas sobre produtos, conteúdos e canais.
16. **Setting**: Parâmetros do sistema persistidos em banco.

---

## 4. Webhook n8n (`POST /api/n8n/events`)

O n8n pode notificar o Affiliate Autopilot enviando requisições HTTP POST para `/api/n8n/events`.

### Autenticação:
Exige o cabeçalho HTTP:
`x-n8n-api-key: <N8N_API_KEY>`

### Exemplo de Payload Válido:
```json
{
  "event": "PRODUCT_DISCOVERED",
  "source": "n8n",
  "timestamp": "2026-07-31T12:00:00.000Z",
  "payload": {
    "externalId": "MLB12345678",
    "title": "Smartphone Exemplo",
    "price": 1299.90
  }
}
```

### Resposta de Sucesso (HTTP 200):
```json
{
  "success": true,
  "eventId": "evt_1722427200000",
  "message": "Evento n8n recebido e registrado com sucesso",
  "processedAt": "2026-07-31T12:00:00.100Z"
}
```
