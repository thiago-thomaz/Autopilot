const headers = { 'x-n8n-api-key': 'n8n_secret_autopilot_key_2026', 'Content-Type': 'application/json' };
const payload = { 
  "event": "DISCOVER_DEALS",
  "payload": {
    "platform": "mercado-livre",
    "query": "fone de ouvido bluetooth",
    "limit": 3
  }
};
fetch('http://localhost:3000/api/n8n/events', { method: 'POST', headers, body: JSON.stringify(payload) })
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
