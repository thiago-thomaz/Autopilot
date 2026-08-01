# MÓDULO 14 — CONTINUOUS LEARNING & SELF OPTIMIZATION ENGINE
## MAPA DE INTEGRAÇÃO INTEGRAL & ARQUITETURA DE DADOS (M14_INTEGRATION_MAP.md)

---

### 1. VISÃO GERAL DO MÓDULO 14
O **MÓDULO 14: Continuous Learning & Self Optimization Engine (Versão Internacional / Enterprise Knowledge System)** é a camada de aprendizado contínuo, meta-aprendizado e autootimização do **Affiliate Autopilot**.

Ele opera em ciclo fechado com os demais módulos da plataforma, porém sob um princípio estrito de **fronteira de execução zero**:
- **M13 (Autonomous Intelligence)** $\rightarrow$ Toma decisões estratégicas e táticas.
- **M11 (Growth Engine) / n8n** $\rightarrow$ Executa ações operacionais no mercado.
- **M14 (Learning Engine)** $\rightarrow$ Aprende continuamente com os resultados reais das execuções, feedback humano e desvios de performance.
- **FRONTEIRA DE SEGURANÇA M14**: O M14 **NUNCA** executa ações operacionais no mercado, **NUNCA** publica conteúdos e **NUNCA** altera decisões passadas. O M14 **APENAS** gera conhecimento reutilizável, validado e versionado, além de emitir sinais de calibração de modelos para o M13 e o M9.

---

### 2. MAPEAMENTO DAS INTERFACES E FLUXOS DE DADOS BIDIRECIONAIS

```
+-----------------------------------------------------------------------------------+
|                        M12 BUSINESS OS & M7 TRACKING/PUBLISHING                   |
|         (Métricas DRE, Lucro Líquido Real, Taxas de Conversão, Cliques, Vendas)   |
+----------------------------------------+------------------------------------------+
                                         |
                       (Métricas Reais) |
                                         v
+----------------------------------------+------------------------------------------+
|                        M13 AUTONOMOUS INTELLIGENCE LAYER                          |
|         (Diário de Decisões, Resultados Esperados, Votos de Agentes Especialistas)|
+----------------------------------------+------------------------------------------+
                                         |
                    (Decisões & Outcomes)|
                                         v
+-----------------------------------------------------------------------------------+
|               M14 CONTINUOUS LEARNING & SELF OPTIMIZATION ENGINE                 |
|  [LearningEvent Ingestion] -> [Normalizer & Validator] -> [RewardEngine]          |
|  -> [PatternEngine] -> [RuleEngine] -> [KnowledgeEngine (Decay & Versioning)]     |
|  -> [Optimizer & ModelRegistry] -> [KnowledgePublisher]                           |
+---------------------+-------------------------------------+-----------------------+
                      |                                     |
    (Sinais Calibração|                                     | (Playbooks & Regras
     & Drift Metrics) |                                     |  Validadas de Decisão)
                      v                                     v
+---------------------+------------------+  +---------------+-----------------------+
|     M9 PREDICTIVE AI ENGINE            |  |  M13 AUTONOMOUS INTELLIGENCE ENGINE   |
| (Calibração de Pesos & Retreinamento)  |  | (Conhecimento Reutilizável/Playbooks) |
+----------------------------------------+  +---------------------------------------+
```

#### 2.1 M11 / M7 / M12 (Outcomes e DRE Executivo) $\longrightarrow$ M14 (Learning Engine)
- **Dados Ingeridos pelo M14**:
  - `M11 (Growth Engine)`: Desempenho de campanhas, leilões de orçamento, fadiga de anúncios, performance por canal (`TikTok`, `Instagram`, `YouTube`, `Google Ads`), país, idioma e tipo de oferta.
  - `M7 (Tracking & Publishing)`: Cliques (`ClickRecord`), conversões (`ConversionRecord`), comissões atribuídas e engajamento de conteúdos publicados.
  - `M12 (Business OS)`: Lucro líquido real por campanha/produto (DRE Executivo), margem de contribuição, retorno marginal sobre investimento (ROI/ROAS real), variação de reserva de caixa.
- **Normalização no M14**:
  - `LearningNormalizer` converte todos os payloads brutos de resultados em instâncias padronizadas de `LearningEvent`.

#### 2.2 M13 (Autonomous Intelligence) $\longrightarrow$ M14 (Learning Engine)
- **Dados Ingeridos pelo M14**:
  - `DecisionJournal`: Registro completo de decisões tomadas ($V_{expected}$ vs $V_{actual}$), justificação de raciocínio, matriz de votação de agentes especializados.
  - `EvaluatedOutcome`: Acurácia da previsão ($0.0 \text{ a } 1.0$), variância do lucro líquido esperado versus real.
  - `AgentConsensusEngine`: Votações individuais de cada agente especializado (ex: `MarketIntelligenceAgent`, `FinancialIntelligenceAgent`).

#### 2.3 M14 (Learning Engine) $\longrightarrow$ M13 (Autonomous Intelligence)
- **Conhecimento e Diretrizes Publicadas**:
  - `DiscoveredKnowledge`: Padrões (`PATTERN`), Regras (`RULE`), Estratégias (`STRATEGY`), Insights (`INSIGHT`), Riscos (`RISK`) e Playbooks (`PLAYBOOK`) validados com score de confiança ($\ge 0–100$).
  - `Agent Weight Calibration`: Sugestões de recalibração ponderada dos 10 agentes do M13 com base na taxa histórica de acerto de cada especialista.
  - `Rule Extraction & Invalidation`: Desativação automática de regras ou playbooks obsoletos cuja evidência contrária supere os limites de confiança.

#### 2.4 M14 (Learning Engine) $\longrightarrow$ M9 (Predictive AI Engine)
- **Sinais de Calibração e Feedback**:
  - `ModelCalibrationRecord`: Fatores de ajuste de tendência (*bias correction*), recalibração de MAE/RMSE/R² para modelos de CVR, EPC e Lucro.
  - `Data & Model Drift Trigger`: Gatilhos de retreinamento de modelo no `ModelTrainingService` do M9 quando desvios estatísticos continuados são detectados.

#### 2.5 M14 $\longleftrightarrow$ n8n Orchestration Layer & Webhooks
- **End-points REST HTTP Inbound (`/api/v1/learning/`)**:
  - `POST /api/v1/learning/event`: Recebe payloads de eventos externos de aprendizado de workflows n8n.
  - `POST /api/v1/learning/feedback`: Recebe feedback explícito (Humano ou Agente).
  - `GET /api/v1/learning/knowledge`: Consulta base de conhecimento filtrada por país, mercado, canal ou tipo.
  - `POST /api/v1/learning/evaluate`: Força ciclo de avaliação e extração de regras.
- **n8n Workflows Integrados**:
  - Workflow de ingestão assíncrona de resultados pós-campanha.
  - Workflow de briefing diário de aprendizado (*Daily Knowledge Digest*).

---

### 3. ARQUITETURA DE SERVIÇOS DESACOPLADOS (`/services/learning/`)

1. **`LearningEngine.ts`** (Core Coordinator):
   - Coordenador principal que gerencia o pipeline de recebimento de eventos, roteamento entre filas e acionamento dos motores especializados.
2. **`LearningNormalizer.ts` & `LearningValidator.ts`**:
   - Valida idempotência, integridade de schema e normaliza dados de M7, M11, M12 e M13 no formato uniforme `LearningEvent`.
3. **`RewardEngine.ts`**:
   - Calcula o sinal de reforço ($R \in [-1.0, +1.0]$) derivado do Lucro Líquido Real / ROI fornecido pelo M12 em relação às expectativas do M13.
4. **`FeedbackEngine.ts`**:
   - Coleta e pondera feedbacks qualitativos e quantitativos humanos e de agentes.
5. **`PatternEngine.ts`**:
   - Descobre padrões estatísticos e agrupamentos não supervisionados entre variáveis contextuais (país, canal, horário, ângulo de conteúdo, faixa de preço).
6. **`RuleEngine.ts`**:
   - Extrai regras lógicas determinísticas ("IF country = US AND channel = TikTok THEN optimal_cvr_boost = 1.25") e gerencia a invalidação de regras antigas.
7. **`KnowledgeEngine.ts`**:
   - Gerencia a taxonomia do conhecimento, decaimento temporal de confiança (`decayFactor`), validade temporal (`validFrom`, `validUntil`) e histórico imutável (`KnowledgeVersion`).
8. **`Optimizer.ts`**:
   - Algoritmo de meta-aprendizado para calibração de hiperparâmetros de decisão e distribuição marginal de investimentos.
9. **`ModelRegistry.ts`** (M14 Calibration Tracking):
   - Rastreia o histórico de calibrações aplicadas sobre os modelos preditivos do M9 e agentes do M13.
10. **`KnowledgePublisher.ts`**:
    - Dispara eventos desacoplados no `EventBus` (`learning.event.received`, `knowledge.published`, `model.calibrated`).

---

### 4. ESTRUTURA DE MODELAGEM BANCO DE DADOS (PRISMA SCHEMA)

Todas as métricas financeiras e taxas utilizam rigorosamente o tipo `Decimal(18, 4)`:

- **`LearningEvent`**:
  - Armazena eventos brutos e normalizados de resultado.
  - Campos: `id`, `timestamp`, `source`, `entityType`, `entityId`, `decisionId`, `campaignId`, `experimentId`, `market`, `country`, `language`, `metrics` (JSON), `context` (JSON), `confidenceScore` (Decimal), `qualityScore` (Decimal), `status` (`NEW`, `VALIDATED`, `PROCESSED`, `REJECTED`, `ARCHIVED`).
- **`DiscoveredKnowledge`**:
  - Armazena itens de conhecimento e regras geradas.
  - Campos: `id`, `knowledgeType` (`PATTERN`, `RULE`, `STRATEGY`, `INSIGHT`, `RISK`, `PLAYBOOK`), `title`, `description`, `confidence` (Decimal), `importance` (Decimal), `decayFactor` (Decimal), `evidence` (JSON), `version` (Int), `status`, `validFrom`, `validUntil`, `createdAt`.
- **`KnowledgeVersion`**:
  - Histórico imutável de alterações de conhecimento.
  - Campos: `id`, `knowledgeId`, `version` (Int), `delta` (JSON), `previousConfidence` (Decimal), `newConfidence` (Decimal), `reason`, `createdAt`.
- **`ModelCalibrationRecord`**:
  - Rastreia ajustes e calibrações emitidas para os módulos M9 e M13.
  - Campos: `id`, `modelId`, `targetModule` (`M9`, `M13`), `previousMetric` (Decimal), `calibratedMetric` (Decimal), `adjustmentFactor` (Decimal), `appliedAt`.

---

### 5. SISTEMA DE FILAS E PRIORIDADES DE PROCESSAMENTO

- **`learning.high` (P0 / P1)**: Eventos de emergência, prejuízos súbitos, falhas graves de execução, gatilhos manuais de feedback de alta prioridade.
- **`learning.medium` (P2)**: Conclusões de campanhas, resultados de testes A/B do M11, diário de decisões do M13.
- **`learning.low` (P3)**: Ingestão de relatórios diários de redes de afiliados e métricas secundárias de cliques.
- **`learning.background` (P4)**: Processamento batch offline de mineração de padrões, recálculo de decaimento de conhecimento e relatórios consolidados.

---

### 6. PLANO INCREMENTAL DE IMPLEMENTAÇÃO (FASE 1 A FASE 10)

- **FASE 1**: Tipos & Interfaces (`/types/learning/learning.types.ts`) e Prisma Schemas (Migrações com `Decimal(18,4)`).
- **FASE 2**: Motores Core (`LearningEngine`, `LearningNormalizer`, `LearningValidator`).
- **FASE 3**: Motor de Reforço e Feedback (`RewardEngine`, `FeedbackEngine`).
- **FASE 4**: Descoberta de Padrões e Extração de Regras (`PatternEngine`, `RuleEngine`).
- **FASE 5**: Governança de Conhecimento e Decaimento (`KnowledgeEngine`, `KnowledgeVersion`).
- **FASE 6**: Meta-otimizador e Registro de Calibração (`Optimizer`, `ModelRegistry`).
- **FASE 7**: EventBus & Publicador de Conhecimento (`KnowledgePublisher`).
- **FASE 8**: Endpoints API REST e Workflows n8n (`/api/v1/learning/`).
- **FASE 9**: Painel de Controle UI (`/app/learning/page.tsx`).
- **FASE 10**: Suíte de Testes (Unitários, Integração, Falhas, Cobertura 100%) e Documentação Final.

---

### 7. CRITÉRIOS DE ACEITAÇÃO (DEFINITION OF DONE DO MAPEAMENTO)
- [x] Inspeção detalhada do código das fases M1 a M13 concluída.
- [x] Mapeamento dos fluxos bidirecionais entre M11, M12, M13, M9, M14 e n8n finalizado.
- [x] Definição de fronteira estrita: M14 possui ZERO privilégios de execução operacional.
- [x] Estrutura das 4 entidades Prisma de aprendizado com `Decimal(18, 4)` especificadas.
- [x] `M14_INTEGRATION_MAP.md` documentado no repositório.
