# MÓDULO 13 — AUTONOMOUS INTELLIGENCE & DECISION LAYER
## MAPA DE INTEGRAÇÃO INTEGRAL & ARQUITETURA DE DADOS (M13_INTEGRATION_MAP.md)

---

### 1. VISÃO GERAL DO MÓDULO 13
O **MÓDULO 13: Autonomous Intelligence & Decision Layer** é o cérebro central de raciocínio (*reasoning*), previsão, priorização, mediação de consenso entre agentes e tomada de decisão autônoma do **Affiliate Autopilot**.

Ele opera como uma camada superior desacoplada que não recria nem substitui os módulos anteriores, mas os orquestra e conecta de forma bidirecional:
- **M9 (Predictive AI)** $\rightarrow$ Fornece modelos estatísticos, scores preditivos de EPC/CVR/Lucro, e sinais de drift/anomalia.
- **M11 (Growth Engine)** $\rightarrow$ Fornece dados operacionais de campanhas, fadiga de criativos e leilão de orçamento; recebe instruções de execução e planos de ação.
- **M12 (Business OS)** $\rightarrow$ Fornece governança financeira, DRE Executivo, trava de reserva de caixa e metas estratégicas; recebe alertas de risco e feedbacks de performance para ajuste estratégico.
- **n8n & EventBus** $\rightarrow$ Dispara e recebe eventos de automação, webhooks idempotentes e fluxos de aprovação humana.

---

### 2. MAPEAMENTO DETALHADO DAS INTERFACES E CONTRATOS BIDIRECIONAIS

```
+-----------------------------------------------------------------------------------+
|                                  M12 BUSINESS OS                                  |
| (Metas, DRE, Trava de Caixa, Tolerância a Risco, Orçamentos, Diretrizes Globais)   |
+----------------------------------------+------------------------------------------+
                                         | ^ (Ajuste de Metas & Escalação)
            (Diretrizes & Trava de Caixa)| |
                                         v |
+----------------------------------------+------------------------------------------+
|                        M13 AUTONOMOUS INTELLIGENCE LAYER                          |
|  [Signal Ingestion] -> [Context Builder] -> [5-Layer Memory] -> [Evidence/Hypo]   |
|  -> [Reasoning/Scenario] -> [Opp/Risk Detection] -> [Prioritization]               |
|  -> [Hierarchical Decision (L1/L2/L3)] -> [Agent Consensus] -> [Action Planner]    |
+----------------------------------------+------------------------------------------+
  ^ (Scores, ML, Drift)                  | | (Planos de Ação & Ordens de Execução)
  | (Feedback & Calibração)              v v
+-+--------------------------------------+-+----------------------------------------+
|       M9 PREDICTIVE AI ENGINE          |         M11 AUTONOMOUS GROWTH ENGINE       |
| (EPC, CVR, Drift, Anomaly Models)      | (Campanhas, Leilão, Tarefas, Retries)   |
+----------------------------------------+------------------------------------------+
```

#### 2.1 M9 (Predictive AI) $\longleftrightarrow$ M13 (Intelligence Layer)
- **M9 $\rightarrow$ M13**:
  - `PredictionService` / `EnsemblePredictionEngine`: Retorna scores preditivos de EPC, CVR, comissão e receita bruta com intervalos de confiança (Lower, Expected, Upper).
  - `DataDriftDetector` / `ModelDriftDetector`: Emite alertas de degradação de modelo preditivo e desvio de distribuição de dados.
  - `AnomalyDetectionEngine` / `EarlyWarningEngine`: Envia sinais de variação súbita de tráfego, ROI ou conversão por canal/produto.
  - `FeatureStore`: Disponibiliza matrizes de características históricas para o `ContextEngine` do M13.
- **M13 $\rightarrow$ M9**:
  - `OutcomeEngine` / `LearningEngine`: Retorna a variância entre os valores previstos ($V_{expected}$) e os resultados reais ($V_{actual}$) para recalibração de pesos de ensemble e gatilhos de retreinamento no M9 (`ModelTrainingService`).

#### 2.2 M11 (Autonomous Growth Engine) $\longleftrightarrow$ M13 (Intelligence Layer)
- **M11 $\rightarrow$ M13**:
  - `CampaignDecisionEngine` / `CampaignOrchestrator`: Notifica estado de saúde de campanhas, fadiga de conteúdo (`ContentFatigueEngine`) e saturação de mercado (`CampaignSaturationEngine`).
  - `CampaignBudgetAuction` / `DynamicBudgetAllocator`: Informa disponibilidades e retornos marginais por campanha (`MarginalReturnEngine`).
  - `GrowthExperimentController`: Envia resultados de testes A/B e experimentos incrementais (`IncrementalityEngine`).
- **M13 $\rightarrow$ M11**:
  - `ActionPlanner`: Converte decisões aprovadas pelo M13 em tarefas de crescimento estruturadas (`GrowthTask`), acionando início, pausa, escalonamento ou alteração de variante sem violar os guardrails do M11 (`AutonomyGuardrailEngine`).

#### 2.3 M12 (Business Operating System) $\longleftrightarrow$ M13 (Intelligence Layer)
- **M12 $\rightarrow$ M13**:
  - `CashReserveManager`: Informa o status de reserva de caixa (`NORMAL`, `WARNING`, `SAFETY_LOCK`). Se em `SAFETY_LOCK`, o M13 veda qualquer ação de gasto autônomo.
  - `TrueBusinessProfitEngine`: Fornece o DRE Executivo em tempo real e margem de lucro líquido real.
  - `BusinessObjectiveEngine` / `GoalGapEngine`: Fornece a taxa diária de execução necessária (*Required Daily Run Rate*) para atingimento das metas do trimestre.
  - `BusinessProfileService`: Define a tolerância a risco (`LOW`, `MEDIUM`, `HIGH`) e modo de automação (`SHADOW`, `PAPER`, `SUPERVISED`, `AUTONOMOUS`).
- **M13 $\rightarrow$ M12**:
  - `HumanApprovalRequest`: Envia solicitações de aprovação para decisões de Nível 3 (Estratégicas).
  - `ExecutiveReportEngine`: Alimenta o Copiloto Executivo C-Suite com memórias históricas e análises contrafactuais ("What-If").
  - `BusinessAlertEngine`: Notifica riscos críticos de concentração ou quebra de elo de afiliados.

#### 2.4 M13 $\longleftrightarrow$ n8n Webhooks & EventBus
- **Inbound Endpoints (Rest API Route Handlers em `/app/api/v1/intelligence/`)**:
  - `POST /api/v1/intelligence/event`: Recebe eventos externos (ex: scraping n8n, relatórios de rede, opt-outs).
  - `POST /api/v1/intelligence/decision`: Executa pipeline de decisão a partir de gatilhos agendados no n8n.
  - `POST /api/v1/intelligence/outcome`: Recebe métricas de resultado pós-execução de tarefas.
  - `POST /api/v1/intelligence/approve` / `reject`: Processa respostas humanas de aprovação via Webhook/Telegram/Dashboard.
  - `GET /api/v1/intelligence/state`: Consulta o estado do *System Digital Twin*.
- **Outbound EventBus Events**:
  - `intelligence.event.received`
  - `intelligence.opportunity.detected`
  - `intelligence.risk.detected`
  - `intelligence.decision.created`
  - `intelligence.decision.approval_required`
  - `intelligence.action.started`
  - `intelligence.outcome.received`
  - `intelligence.learning.completed`

---

### 3. ARQUITETURA DE MEMÓRIA EM 5 CAMADAS (`MemorySystem`)

1. **Episodic Memory (Memória Episódica)**:
   - Armazena histórico detalhado de cada evento ocorrido e decisão tomada, incluindo contexto, timestamps, atores e desfechos.
2. **Semantic Memory (Memória Semântica)**:
   - Conhecimento estruturado e generalizado sobre nichos, categorias de produtos, comportamento de canais (ex: TikTok vs Instagram) e dinâmicas de conversão por país.
3. **Strategic Memory (Memória Estratégica)**:
   - Diretrizes do M12, OKRs vigentes, limites de tolerância a risco, travas de reserva de caixa e parâmetros do perfil de negócios.
4. **Procedural Memory (Memória Procedural)**:
   - Playbooks de ação, sequências de tarefas, workflows de automação, planos de rollback e regras de execução validadas.
5. **Working Memory (Memória de Trabalho)**:
   - Buffer temporário de estado volátil utilizado exclusivamente durante o ciclo de raciocínio da sessão atual.

*Governança de Memória*: Inclui mecanismo de decaimento temporal (`memory_decay`), validação de consistência (`memory_validation`), resolução de conflitos (`memory_conflict_detection`) e atribuição de pontuação de confiança (`confidenceScore`).

---

### 4. HIERARQUIA DE DECISÃO & CONSENSO MULTI-AGENTE

#### 4.1 Níveis de Decisão (Decision Levels)
- **LEVEL 1 — OPERATIONAL (Baixo Impacto)**:
  - Exemplos: Troca de horário de postagem, substituição de variante de texto.
  - Execução: 100% Autônoma (se no nível de autonomia do M12 `SUPERVISED`/`AUTONOMOUS`).
- **LEVEL 2 — TACTICAL (Médio Impacto)**:
  - Exemplos: Realocação de até 15% do orçamento entre campanhas existentes, pausa de produto com fadiga.
  - Execução: Avaliada contra regras estritas do M12 e limites orçamentários.
- **LEVEL 3 — STRATEGIC (Alto Impacto)**:
  - Exemplos: Entrada em novo país/mercado, alteração no perfil de risco, gastos acima do limite autônomo diário.
  - Execução: Obrigatoriamente requer aprovação humana (`REQUIRE_APPROVAL`).

#### 4.2 Agentes Especializados e Consenso Ponderado
- **10 Agentes Especializados**:
  1. `MarketIntelligenceAgent` (M10)
  2. `ProductIntelligenceAgent` (M3/M4)
  3. `ContentIntelligenceAgent` (M5)
  4. `ChannelIntelligenceAgent` (M6)
  5. `AffiliateIntelligenceAgent` (M2)
  6. `FinancialIntelligenceAgent` (M12)
  7. `RiskComplianceAgent` (M8/M12)
  8. `ExperimentationAgent` (M11)
  9. `GrowthAgent` (M11)
  10. `StrategyAgent` (M12)
- **AgentConsensusEngine**:
  - Calcula o voto ponderado por especialista: $\text{Weighted Consensus} = \sum (\text{Vote}_i \times \text{Weight}_i)$.
  - Calcula a divergência inter-agente (`disagreement_score`). Se o desvio for $> 0.35$, exige evidências adicionais ou escala para aprovação humana.

---

### 5. GUARDA-ROUPAS DE SEGURANÇA E PROTEÇÃO CONTRA PROMPT INJECTION
- **Sanitização de Dados Externos**: Qualquer texto de terceiros (descrições da Amazon, comentários de redes sociais, retornos de scraping) é sanitizado e envelopado como bloco `<EXTERNAL_DATA>` (NÃO INSTRUÇÃO), impedindo ataques de Prompt Injection sobre os modelos LLM.
- **Idempotência Estrita**: Toda decisão e plano de ação gera uma `idempotencyKey` única determinística baseada no Hash(EventID + DecisionType + EntityID) para evitar duplicidade de execução no n8n.
- **Hierarquia de Kill Switches**:
  - `GLOBAL_KILL_SWITCH` (Desliga todo o M13 e congela ações)
  - `CHANNEL_KILL_SWITCH` (Pausa ações em um canal específico)
  - `CAMPAIGN_KILL_SWITCH` (Pausa ações em uma campanha específica)
  - `PRODUCT_KILL_SWITCH` (Pausa ações em um produto específico)
  - `AGENT_KILL_SWITCH` (Desativa um agente especializado)
  - `AUTONOMY_KILL_SWITCH` (Reverte autonomia para modo 100% supervisionado/manual)

---

### 6. PLANO DE EXECUÇÃO DETALHADO (FASE 1 A FASE 22)

- **PHASE 1**: Architecture & Core Interfaces (`/types/intelligence/`)
- **PHASE 2**: Database Migrations (Schemas Prisma do M13)
- **PHASE 3**: Event Bus & Ingestion Pipeline (`SignalIngestionEngine`, `EventBus`)
- **PHASE 4**: ContextEngine & System Digital Twin State (`ContextEngine`, `DigitalTwinService`)
- **PHASE 5**: MemoryEngine (5 Camadas: Episódica, Semântica, Estratégica, Procedural, Working)
- **PHASE 6**: EvidenceEngine & HypothesisEngine
- **PHASE 7**: ReasoningEngine, ScenarioEngine & CounterfactualEngine
- **PHASE 8**: PredictionEngine & Adapters M9
- **PHASE 9**: OpportunityDetectionEngine & RiskDetectionEngine
- **PHASE 10**: ScoringEngine & PrioritizationEngine
- **PHASE 11**: DecisionEngine & Hierarchical Levels (L1, L2, L3)
- **PHASE 12**: DecisionPolicyEngine & ConfidenceEngine
- **PHASE 13**: Specialized Agent Framework (10 Agentes)
- **PHASE 14**: AgentOrchestrator & AgentConsensusEngine
- **PHASE 15**: ActionPlanner, RollbackEngine & OutcomeEngine
- **PHASE 16**: LearningEngine & DecisionJournal
- **PHASE 17**: ModelRouter & AIUsageOptimizer
- **PHASE 18**: Adapters M9, M11 e M12
- **PHASE 19**: Endpoints API `/api/v1/intelligence/` e 12 Workflows n8n
- **PHASE 20**: Dashboard `/intelligence` e Explainability UI
- **PHASE 21**: Suite de Testes (Unitários, Integração, Mocks de Falha e E2E)
- **PHASE 22**: Documentação Técnica Final do Módulo 13

---

### 7. CRITÉRIOS DE ACEITAÇÃO (DEFINITION OF DONE DO MAPEAMENTO)
- [x] Inspeção completa da base de código dos Módulos 1 ao 12.
- [x] Mapeamento das integrações M9, M11, M12 e n8n documentado sem duplicação de funcionalidades.
- [x] Estrutura das 5 camadas de memória e 3 níveis de decisão definidos.
- [x] Proteção anti-prompt injection, disjuntores de segurança e idempotência mapeados.
- [x] `M13_INTEGRATION_MAP.md` gerado no repositório.
