export const SHORT_VIDEO_SCRIPT_PROMPT = `
Crie um roteiro de vídeo curto (0 a 30 segundos) para Reels / TikTok / Shorts:
Produto: {{title}}
Preço: R$ {{currentPrice}}

Formato das Cenas (4 Cenas):
- Cena 1 (0-5s): Gancho visual + narração rápida da dor/desejo
- Cena 2 (5-15s): Apresentação do produto e demonstrativo visual
- Cena 3 (15-25s): Benefício principal ou valor do desconto
- Cena 4 (25-30s): CTA para o link na bio / comentário
`;
