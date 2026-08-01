# Affiliate Autopilot — Módulo 7: Analytics, Attribution, Revenue & Intelligence Engine (Versão Internacional)

## 1. Visão Geral
O **Módulo 7** é a camada de inteligência de dados, atribuição multi-touch e análise financeira da plataforma **Affiliate Autopilot**. Ele transforma eventos brutos em métricas consolidadas de receita, custo, lucro líquido, ROI, EPC, CVR, CTR e gera recomendações orientadas a dados.

## 2. Pipeline de Processamento
`EVENT COLLECTION` → `EVENT NORMALIZATION` → `IDENTITY / SESSION` → `CLICK ATTRIBUTION` → `CONVERSION ATTRIBUTION` → `SALE RECONCILIATION` → `COMMISSION ENGINE` → `REVENUE ENGINE` → `COST ENGINE` → `PROFIT ENGINE` → `ROI ENGINE` → `PERFORMANCE ENGINE` → `SCORING ENGINE` → `ANOMALY DETECTION` → `OPTIMIZATION SIGNALS` → `DASHBOARD` → `N8N`

## 3. Regras Financeiras & Câmbio FX
- **Receita Real de Afiliado**: A receita do sistema é calculada **EXCLUSIVAMENTE** a partir das comissões aprovadas/esperadas (`commissionRevenue`), JAMAIS pelo valor bruto da venda do produto final.
- **Lucro Líquido**: `Lucro = Receita de Comissão - Custos Atribuíveis`. Se o custo for 0, o `ROI` é sinalizado como `null` (`NOT_AVAILABLE`).
- **Conversão de Câmbio (FX)**: Valores em moedas diferentes são convertidos para a moeda base (padrão `BRL`) mantendo os registros originais e a taxa histórica.

## 4. Modelos de Atribuição Suportados (5 Modelos)
- `LAST_CLICK`: 100% de crédito para o último ponto de contato.
- `FIRST_CLICK`: 100% de crédito para a primeira atração.
- `LINEAR`: Divisão igualitária de crédito entre todos os pontos da jornada.
- `POSITION_BASED`: 40% no primeiro clique, 40% no último clique e 20% distribuídos no meio.
- `TIME_DECAY`: Ponderação exponencial favorecendo eventos mais recentes antes da conversão.

## 5. Detecção de Anomalias & Sinais de Otimização
- **AnomalyDetectionEngine**: Alertas automatizados para quedas acentuadas de CTR ou picos atípicos de custos.
- **RecommendationEngine**: Emissão de `OptimizationSignal` (ex: `INCREASE_PRIORITY`, `PAUSE`). O Módulo 7 não executa alterações autônomas de campanhas (isso é exclusivo do Módulo 8).
