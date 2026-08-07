const headers = { 'x-n8n-api-key': 'n8n_secret_autopilot_key_2026', 'Content-Type': 'application/json' };
const payload = {
  "event": "DISCOVER_DEALS",
  "payload": {
    "products": [
      {
        "id": "B0CTQZ1YKS",
        "title": "Novo Samsung Galaxy S24 Ultra (512GB)",
        "category": "Smartphones",
        "price": {}
      }
    ],
    "source": "AMAZON"
  }
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
