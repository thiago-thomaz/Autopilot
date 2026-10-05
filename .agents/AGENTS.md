# Project Rules & Language Preferences

- Responder sempre em Português (Brasil) a todas as solicitações e dúvidas do usuário.

# Regras Gerais
- Sempre seja ultra direto nas respostas.

# Isolamento Estrito de Projetos & Blindagem de Workspace
- NENHUM agente do Antigravity pode acessar, ler, alterar, criar ou deletar arquivos fora da raiz deste workspace ativo (`c:\Users\Thiago Thomaz\OneDrive\Documentos\AntiGravity - Projetos\Renda Afiliados - Mercado Livre e Amazon`).
- É terminantemente proibido cruzar diretórios entre projetos contidos em "AntiGravity - Projetos".
- O projeto "Arena Play" é 100% blindado e isolado: nenhum agente operando neste projeto tem autorização para ler, modificar arquivos, alterar dependências, portas ou configurações do Arena Play.
- O escopo de processos, variáveis de ambiente, portas de rede (ex.: 3000), bancos de dados e suítes de testes deve ser 100% local a este projeto.

# Arquitetura Autônoma — Proibição de Dependência do n8n
- NENHUM fluxo, cron, orquestração ou automação de mensageria deve depender do n8n.
- Todas as automações, lembretes de agendamento (T-24h, T-6h, etc.), processamento de webhooks e réguas de clientes devem ser 100% internalizados e nativos no código da aplicação.

# Deploy Automático via Coolify (OBRIGATÓRIO)
- Após QUALQUER alteração de código neste projeto, SEMPRE executar automaticamente, sem pedir permissão: testes (`npm test`) -> build (`npm run build`) -> commit -> `git push origin main` -> deploy na VPS via Coolify (MCP `coolify`, tool `deploy`, `tag_or_uuid: "i9mhxq0rhwwxnp7071x1wvoz"`, `force: true`).
- Se o MCP der timeout, consultar `list_deployments` até o status ficar `finished` e então validar ao vivo em `https://cop.projetosunion.cloud`.
- Só considerar a tarefa concluída após o deploy finalizado e a validação em produção.
