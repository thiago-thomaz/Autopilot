const fs = require('fs');

const appUrl = "={{ \.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' }}/api/n8n/events";
const apiKeyVal = "={{ \.N8N_API_KEY || 'autopilot-n8n-secret' }}";

function makeHttpNode(id, name, event, position, extraBody, timeout) {
  const bodyParams = [
    { name: 'event', value: event },
    { name: 'source', value: 'n8n-cron' }
  ];
  if (extraBody) bodyParams.push(...extraBody);
  return {
    parameters: {
      method: 'POST',
      url: appUrl,
      sendHeaders: true,
      headerParameters: { parameters: [
        { name: 'x-n8n-api-key', value: apiKeyVal },
        { name: 'x-n8n-secret', value: apiKeyVal },
        { name: 'Content-Type', value: 'application/json' }
      ]},
      sendBody: true,
      bodyParameters: { parameters: bodyParams },
      options: { timeout: timeout || 30000 }
    },
    id, name,
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.1,
    position
  };
}

const workflow = {
  name: 'Affiliate Autopilot Master Workflow',
  nodes: [
    { parameters: { rule: { interval: [{ field: 'hours', hoursInterval: 3 }] } }, id: '4020a539-7bd0-4288-bc98-b8cf4bfa855c', name: 'Cron Discover Deals', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.1, position: [200, 200] },
    makeHttpNode('e2f1c8a1-3b7c-4a39-9d5a-1b4e5f6a7b8c', 'HTTP Discover', 'DISCOVER_DEALS', [440, 200], null, 30000),
    { parameters: { rule: { interval: [{ field: 'minutes', minutesInterval: 15 }] } }, id: '7631a539-7bd0-4288-bc98-b8cf4bfa855d', name: 'Cron Publish', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.1, position: [200, 420] },
    makeHttpNode('e2f1c8a1-3b7c-4a39-9d5a-1b4e5f6a7b8d', 'HTTP Publish', 'PROCESS_PUBLISH_QUEUE', [440, 420], null, 30000),
    { parameters: { rule: { interval: [{ field: 'cronExpression', expression: '0 6 * * *' }] } }, id: '1631a539-7bd0-4288-bc98-b8cf4bfa855e', name: 'Cron Conversions', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.1, position: [200, 640] },
    makeHttpNode('e2f1c8a1-3b7c-4a39-9d5a-1b4e5f6a7b8e', 'HTTP Conversions', 'IMPORT_CONVERSIONS', [440, 640], [{ name: 'payload', value: '{"data":[]}' }], 60000),
    { parameters: { rule: { interval: [{ field: 'cronExpression', expression: '0 3 * * *' }] } }, id: '2631a539-7bd0-4288-bc98-b8cf4bfa855f', name: 'Cron Cleanup', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.1, position: [200, 860] },
    makeHttpNode('e2f1c8a1-3b7c-4a39-9d5a-1b4e5f6a7b8f', 'HTTP Cleanup', 'CLEANUP_EXPIRED_DATA', [440, 860], null, 120000)
  ],
  connections: {
    'Cron Discover Deals': { main: [[{ node: 'HTTP Discover', type: 'main', index: 0 }]] },
    'Cron Publish': { main: [[{ node: 'HTTP Publish', type: 'main', index: 0 }]] },
    'Cron Conversions': { main: [[{ node: 'HTTP Conversions', type: 'main', index: 0 }]] },
    'Cron Cleanup': { main: [[{ node: 'HTTP Cleanup', type: 'main', index: 0 }]] }
  },
  settings: { executionOrder: 'v1', saveManualExecutions: true, callerPolicy: 'workflowsFromSameOwner' },
  staticData: null,
  tags: ['autopilot', 'affiliate', 'production'],
  pinData: {}
};

fs.writeFileSync('./docs/affiliate-autopilot-n8n.json', JSON.stringify(workflow, null, 2));
console.log('✅ JSON do n8n gerado com sucesso!');
console.log('Nodes:', workflow.nodes.length);
console.log('Connections:', Object.keys(workflow.connections).length);
