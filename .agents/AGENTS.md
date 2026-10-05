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
