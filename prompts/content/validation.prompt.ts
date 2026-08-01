export const VALIDATION_PROMPT = `
Audite o conteúdo gerado para garantir 100% de precisão factual contra os fatos reais do produto:
Fatos Verificados: {{verifiedFactsJson}}
Conteúdo Gerado: {{generatedText}}

Verifique:
1. Houve alteração no preço real ou desconto?
2. Foram inventadas características técnicas inexistentes?
3. Foram incluídos depoimentos falsos?

Se houver alucinação, marque UNSUPPORTED_CLAIM e liste as alegações incorretas.
`;
