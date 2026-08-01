export const CAPTION_GENERATION_PROMPT = `
Crie uma legenda persuasiva e transparente para publicação:
Produto: {{title}}
Preço: R$ {{currentPrice}}
Desconto: {{discountPercent}}%
Descrição Oficial: {{description}}

Estrutura da Legenda:
1. Hook Inicial
2. Problema/Solução ou Benefício Chave
3. Bullets com 3 características comprovadas
4. Chamada para Ação (CTA) clara (ex: "Confira o preço atualizado no link")
5. Aviso legal transparente: "#afiliado #parceiro"
`;
