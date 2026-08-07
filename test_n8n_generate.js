const headers = { 'x-n8n-api-key': 'n8n_secret_autopilot_key_2026', 'Content-Type': 'application/json' };
const payload = {
  "event": "GENERATE_POSTS",
  "deals": [
    {
      "id": "prod_123",
      "affiliatePlatformId": "f8f476a2-ce7a-47d1-b564-bd5bffd6dbfb",
      "title": "Celular Fictício",
      "url": "https://amazon.com.br/dp/123",
      "imageUrl": "https://img",
      "category": "Eletrônicos",
      "brand": "Samsung",
      "currentPrice": 2000,
      "currency": "BRL",
      "availability": true,
      "sourceType": "API"
    }
  ]
};
(async () => {
  try {
    let res = await fetch('https://cop.projetosunion.cloud/api/n8n/events?t=' + Date.now(), { method: 'POST', headers, body: JSON.stringify(payload) });
    let text = await res.text();
    console.log(text);
  } catch(e) {
    console.error(e);
  }
})();
