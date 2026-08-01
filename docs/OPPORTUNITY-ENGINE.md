# Opportunity Engine — Guia Técnico (Módulo 4)

## Visão Geral
O **Opportunity Engine** é o motor determinístico do **Affiliate Autopilot** responsável por analisar produtos descobertos, calcular pontuações relativas de oportunidade (**Opportunity Score** de 0 a 100), estimar a confiança dos dados (**Confidence Score**) e determinar o grau de prioridade operacional (**P0 a P4**) para criação de conteúdo.

---

## 1. Regra Fundamental
- O **Opportunity Score** é uma estimativa matemática relativa de oportunidade.
- **NUNCA** representa garantia de vendas ou de lucro.
- Termos como "venda garantida", "lucro garantido" e "produto vencedor" são estritamente proibidos.

---

## 2. Fluxo Principal de Análise

```
PRODUCT
  └─> LOAD CURRENT DATA & PRICE HISTORY
  └─> CHECK BLOCKLIST / ALLOWLIST (OpportunityEligibilityService)
  └─> EXTRACT RAW FACTORS (OpportunityFactorService)
  └─> CALCULATE SUB-SCORES (Preço, Desconto, Histórico, Rating, Comissão, Demanda, Conteúdo)
  └─> APPLY WEIGHTS & BONUSES & PENALTIES (OpportunityScoringService)
  └─> CLAMP SCORE (0 to 100) via Math.max(0, Math.min(100, score))
  └─> CLASSIFY (OpportunityClassificationService)
  └─> GENERATE EXPLANATION (OpportunityExplanationService)
  └─> PERSIST SNAPSHOT (OpportunityPersistenceService - v1.0.0)
  └─> RETURN RESULT
```

---

## 3. Pesos Iniciais do Algoritmo (`v1.0.0`)

| Fator | Peso (%) | Descrição |
| :--- | :---: | :--- |
| **Preço / Oferta** | 20% | Atratividade em relação às faixas doces (R$ 50 - R$ 1.500) |
| **Histórico de Preço** | 15% | Proximidade da menor marca e estabilidade histórica |
| **Comissão** | 15% | Valor absoluto estimado e taxa de comissão do programa |
| **Avaliação (Rating)** | 10% | Nota média dada pelos compradores (ex: 4.7+ excelente) |
| **Volume de Reviews** | 10% | Normalização logarítmica da contagem de avaliações |
| **Demanda Observada** | 10% | Desempenho em cliques/conversões (50 se desconhecido) |
| **Potencial de Conteúdo**| 10% | Facilidade de criação de reviews, vídeos e tutoriais |
| **Disponibilidade** | 5% | Estoque (penalidade severa de -30 se fora de estoque) |
| **Qualidade dos Dados** | 5% | Completude de imagem, título, marca e descrição |

---

## 4. Classificação por Faixas e Prioridades

| Faixa de Score | Classificação | Prioridade | Descrição |
| :---: | :--- | :---: | :--- |
| **90 – 100** | `EXCEPTIONAL` | **P0** | Máxima prioridade para criação imediata de conteúdo |
| **80 – 89** | `HIGH` | **P1** | Alta prioridade de publicação |
| **70 – 79** | `GOOD` | **P2** | Boa oportunidade com boa margem |
| **60 – 69** | `MODERATE` | **P3** | Oportunidade moderada |
| **40 – 59** | `LOW` | **P4** | Baixa atratividade |
| **0 – 39** | `VERY_LOW` | **P4** | Pouco recomendado |

---

## 5. Score Ajustado e Score de Confiança
- **Confidence Score (0–100)**: Mede a completude dos dados (histórico suficiente, produto em estoque, comissão confirmada).
- **Adjusted Opportunity Score**: `Score * (0.5 + 0.5 * (ConfidenceScore / 100))`. Permite ordenar a fila de execução sem alterar a pontuação matemática pura.

---

## 6. Endpoints da API & Webhooks n8n

### REST APIs:
- `GET /api/opportunities`: Lista snapshots de oportunidade com filtros.
- `GET /api/opportunities/:productId`: Snapshot mais recente do produto.
- `GET /api/opportunities/:productId/history`: Histórico de snapshots do produto.
- `POST /api/opportunities/analyze/:productId`: Executa análise individual.
- `POST /api/opportunities/recalculate`: Executa recálculo em lote.
- `GET /api/opportunities/top`: Ranking das melhores oportunidades.
- `GET`, `PATCH` `/api/opportunity-config`: Ajuste de pesos e parâmetros.
- `GET /api/opportunity-alerts`: Lista alertas de oportunidade.

### Endpoints n8n (`x-n8n-api-key`):
- `POST /api/n8n/opportunities/analyze`
- `POST /api/n8n/opportunities/analyze-batch`
- `POST /api/n8n/opportunities/top`
