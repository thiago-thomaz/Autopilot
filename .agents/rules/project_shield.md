# Diretrizes de Blindagem e Isolamento Estrito do Projeto

## 1. Confinamento Absoluto de Workspace
- **Raiz Exclusiva:** Qualquer agente de IA ou processo automatizado está estritamente restrito à raiz deste workspace (`c:\Users\Thiago Thomaz\OneDrive\Documentos\AntiGravity - Projetos\Renda Afiliados - Mercado Livre e Amazon`).
- **Proibição de Acesso Cruzado:** É terminantemente proibido ler, listar, criar, modificar ou excluir arquivos fora deste diretório.
- **Isolamento de Projetos-Irmãos:** Nenhum arquivo de outros projetos localizados em "AntiGravity - Projetos" pode ser inspecionado ou alterado. Em especial, o projeto "Arena Play" é 100% blindado e intocável por este e qualquer outro agente.

## 2. Processos, Variáveis e Ambientes 100% Locais
- **Ambiente Local:** Variáveis de ambiente, portas de rede (ex.: 3000), processos de desenvolvimento, instâncias de banco de dados e testes devem ser exclusivamente locais a este projeto.
- **Segurança de Segredos:** Arquivos contendo credenciais reais (`.env`, `.env.local`, `.env.production`, etc.) jamais devem ser versionados ou expostos. Use sempre o `.env.example` como gabarito seguro.
- **Portas e Serviços:** Evitar colisões de portas e garantir que serviços auxiliares rodem apenas dentro do ciclo de vida deste workspace.

## 3. Arquitetura Autônoma e Sem Dependência Externa
- **Autonomia Total:** Toda automação, agendamento de cron, regras de negócio e mensageria devem ser internalizadas e nativas no código da aplicação.
- **Sem Dependência do n8n:** Nenhuma orquestração ou fluxo central deve depender criticamente de infraestrutura externa do n8n.

## 4. Comunicação
- **Diretriz de Resposta:** Respostas devem ser sempre ultra diretas, objetivas e em Português (Brasil).
