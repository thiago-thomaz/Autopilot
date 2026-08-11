const headers = { 'x-n8n-api-key': 'n8n_secret_autopilot_key_2026', 'Content-Type': 'application/json' };
const payload = {
  "event": "DISCOVER_DEALS",
  "payload": {
    "platform": "mercado-livre",
    "query": "fone de ouvido bluetooth",
    "limit": 3
  }
};
(async () => {
  try {
    console.log("=== INICIANDO DESCOBERTA DE PRODUTOS ===");
    let res = await fetch('https://cop.projetosunion.cloud/api/n8n/events?t=' + Date.now(), { method: 'POST', headers, body: JSON.stringify(payload) });
    let data = await res.json();
    console.log(JSON.stringify(data, null, 2));
    
    if(data.success && data.data && data.data.products && data.data.products.length > 0) {
      console.log(`\n=== DESCOBERTA OK! ENCONTRADOS ${data.data.products.length} PRODUTOS. INICIANDO GERAÇÃO DE POSTS ===`);
      const deals = data.data.products;
      
      const generatePayload = {
        "event": "GENERATE_POSTS",
        "deals": deals
      };
      
      let res2 = await fetch('https://cop.projetosunion.cloud/api/n8n/events?t=' + Date.now(), { method: 'POST', headers, body: JSON.stringify(generatePayload) });
      let data2 = await res2.json();
      console.log(JSON.stringify(data2, null, 2));
      
      if(data2.success) {
         console.log(`\n=== GERAÇÃO DE POSTS OK! ENVIANDO PARA O TELEGRAM ===`);
         const publishPayload = { "event": "PROCESS_PUBLISH_QUEUE" };
         let res3 = await fetch('https://cop.projetosunion.cloud/api/n8n/events?t=' + Date.now(), { method: 'POST', headers, body: JSON.stringify(publishPayload) });
         let data3 = await res3.json();
         console.log(JSON.stringify(data3, null, 2));
      }
    } else {
      console.log("Nenhum produto descoberto.");
    }
  } catch(e) {
    console.error(e);
  }
})();
