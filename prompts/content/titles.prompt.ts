export const TITLE_GENERATION_PROMPT = `
Gere um Título atrativo e honesto para o produto:
Produto: {{title}}
Canal Alvo: {{channel}}
Preço: R$ {{currentPrice}}

Diretrizes:
- Título conciso (máximo 60 caracteres).
- Destaque a proposta de valor real ou o desconto legítimo.
- Proibido usar palavras sensacionalistas como "Garantido", "Milagre" ou "Segredo Revelado".
`;
