import fs from 'fs';
import path from 'path';

async function syncWorkflow() {
  console.log('Iniciando sincronização do Workflow n8n...');
  const workflowPath = path.join(__dirname, '../docs/affiliate-autopilot-n8n.json');
  const workflowJson = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));

  const n8nUrl = process.env.N8N_API_URL;
  const n8nApiKey = process.env.N8N_API_KEY;

  if (!n8nUrl || !n8nApiKey) {
    console.log('Variáveis N8N_API_URL ou N8N_API_KEY não encontradas no ambiente.');
    console.log('O arquivo docs/affiliate-autopilot-n8n.json foi gerado com sucesso e está pronto para upload manual no n8n.');
    return;
  }

  try {
    const response = await fetch(`${n8nUrl}/api/v1/workflows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': n8nApiKey
      },
      body: JSON.stringify(workflowJson)
    });

    if (response.ok) {
      console.log('Workflow sincronizado e criado com sucesso na instância n8n!');
    } else {
      const errorData = await response.json();
      console.error('Falha ao sincronizar workflow na API do n8n:', errorData);
    }
  } catch (error) {
    console.error('Erro de conexão ao tentar sincronizar com o n8n:', error);
    console.log('Arquivo docs/affiliate-autopilot-n8n.json mantido para uso local.');
  }
}

syncWorkflow();
