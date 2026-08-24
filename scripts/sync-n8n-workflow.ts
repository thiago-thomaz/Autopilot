import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function syncWorkflow() {
  console.log('=== Sincronização do Workflow n8n ===');
  const workflowPath = path.join(__dirname, '../docs/affiliate-autopilot-n8n.json');
  
  if (!fs.existsSync(workflowPath)) {
    console.error('❌ Arquivo docs/affiliate-autopilot-n8n.json não encontrado.');
    process.exit(1);
  }

  const workflowJson = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
  console.log(`✅ Workflow carregado: "${workflowJson.name}"`);
  console.log(`   Nodes: ${workflowJson.nodes?.length} | Connections: ${Object.keys(workflowJson.connections || {}).length}`);

  const n8nUrl = process.env.N8N_API_URL;
  const n8nApiKey = process.env.N8N_API_KEY;

  if (!n8nUrl || !n8nApiKey) {
    console.log('\n⚠️  Variáveis N8N_API_URL ou N8N_API_KEY não configuradas.');
    console.log('   ✅ docs/affiliate-autopilot-n8n.json pronto para import manual no n8n.');
    console.log('\n📋 Para importar manualmente:');
    console.log('   1. Acesse sua instância n8n');
    console.log('   2. Vá em Workflows > Import from File');
    console.log('   3. Selecione: docs/affiliate-autopilot-n8n.json');
    console.log('   4. Ative o workflow após importar');
    return;
  }

  console.log(`\n🔗 Conectando à instância n8n: ${n8nUrl}`);

  try {
    // Verificar se já existe o workflow
    const listRes = await fetch(`${n8nUrl}/api/v1/workflows?name=${workflowJson.name}`, {
      headers: { 'X-N8N-API-KEY': n8nApiKey, 'Content-Type': 'application/json' }
    });
    const listData = listRes.ok ? await listRes.json() : { data: [] };
    const existing = listData?.data?.find((w: any) => w.name === workflowJson.name);

    let response;
    if (existing) {
      console.log(`   Workflow existente encontrado (id: ${existing.id}). Atualizando...`);
      response = await fetch(`${n8nUrl}/api/v1/workflows/${existing.id}`, {
        method: 'PUT',
        headers: { 'X-N8N-API-KEY': n8nApiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(workflowJson)
      });
    } else {
      console.log('   Criando novo workflow na instância n8n...');
      response = await fetch(`${n8nUrl}/api/v1/workflows`, {
        method: 'POST',
        headers: { 'X-N8N-API-KEY': n8nApiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(workflowJson)
      });
    }

    if (response.ok) {
      const created = await response.json();
      const wfId = created?.id || created?.data?.id;
      console.log(`✅ Workflow sincronizado com sucesso! ID: ${wfId}`);

      // Ativar o workflow
      if (wfId) {
        const activateRes = await fetch(`${n8nUrl}/api/v1/workflows/${wfId}/activate`, {
          method: 'POST',
          headers: { 'X-N8N-API-KEY': n8nApiKey }
        });
        if (activateRes.ok) {
          console.log('✅ Workflow ATIVADO com sucesso! Triggers ativos em produção.');
        } else {
          console.warn('⚠️  Workflow criado mas não foi possível ativar automaticamente. Ative manualmente.');
        }
      }
    } else {
      const errorData = await response.text();
      console.error('❌ Falha ao sincronizar workflow na API do n8n:', response.status, errorData);
      process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ Erro de conexão com o n8n:', error.message);
    console.log('ℹ️  Arquivo docs/affiliate-autopilot-n8n.json disponível para import manual.');
    process.exit(1);
  }
}

syncWorkflow();
