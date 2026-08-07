const headers = { 'x-n8n-api-key': 'n8n_secret_autopilot_key_2026', 'Content-Type': 'application/json' };
const payload = { "event": "PROCESS_PUBLISH_QUEUE" };
fetch('http://localhost:3000/api/n8n/events', { method: 'POST', headers, body: JSON.stringify(payload) })
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
