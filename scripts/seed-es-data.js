const { Client } = require('@elastic/elasticsearch');

const ES_NODE = process.env.ELASTICSEARCH_NODE || 'http://localhost:9200';
const INDEX =
  process.env.ELASTICSEARCH_INDEX_SECURITY_ALERTS || 'security-alerts';
const TOTAL_RECORDS = parseInt(process.env.SEED_COUNT || '1000000', 10);
const BATCH_SIZE = 5000;

const INTERNAL_IPS = [
  '192.168.10.25',
  '192.168.10.30',
  '192.168.20.50',
  '192.168.50.11',
  '192.168.30.5',
];

const EXTERNAL_ATTACKER_IPS = [
  '185.220.101.5',
  '45.95.168.2',
  '8.8.8.8',
  '10.0.0.9',
  '10.0.0.5',
  '172.16.5.4',
  '192.168.1.100',
  '203.0.113.42',
  '198.51.100.7',
  '192.0.2.100',
  '45.33.32.156',
  '104.236.228.48',
  '178.62.197.84',
  '5.188.86.114',
  '185.220.100.252',
  '23.129.64.100',
  '109.70.100.52',
  '185.220.101.34',
  '77.247.181.163',
  '195.176.3.23',
];

const SIGNATURES = [
  { name: 'BROWSER-CHROME CVE-2023-3079 Exploit Attempt', weight: 3 },
  { name: 'COMMUNITY SQL Injection Attempt', weight: 2 },
  { name: 'ET SCAN Potential SSH Scan', weight: 4 },
  { name: 'MALWARE-OTHER Win.Trojan.Generic', weight: 2 },
  { name: 'INDICATOR-SCAN PING BSD', weight: 3 },
  { name: 'PROTOCOL-SNMP Request Generic Attempt', weight: 2 },
  { name: 'ET POLICY Outbound Connection to Port 4444', weight: 1 },
  { name: 'MALWARE-CNC Win.Trojan.Agent Message', weight: 1 },
  { name: 'SERVER-WEBAPP Apache Struts RCE Attempt', weight: 1 },
  { name: 'ET EXPLOIT Possible Log4j Exploit Attempt', weight: 2 },
  { name: 'OS-WINDOWS Microsoft Exchange SSRF Attempt', weight: 1 },
  { name: 'SERVER-WEBAPP PHP CGI Argument Injection', weight: 2 },
  { name: 'ET SCAN Potential VNC Scan', weight: 2 },
  { name: 'MALWARE-OTHER Win.Trojan.GenericX Detection', weight: 1 },
  { name: 'INDICATOR-COMPROMISE DNS query to known malware C2', weight: 2 },
  { name: 'SERVER-WEBAPP Jenkins Script Console Attempt', weight: 1 },
  { name: 'OS-LINUX Linux.Worm.Mirai Activity', weight: 1 },
  { name: 'ET POLICY Cryptocurrency Mining Pool Connection', weight: 2 },
  { name: 'SERVER-WEBAPP Node.js Prototype Pollution Attempt', weight: 1 },
  { name: 'MALWARE-CNC Win.Trojan.Emotet C2 Communication', weight: 1 },
];

const SEVERITY_MAP = {
  'BROWSER-CHROME CVE-2023-3079 Exploit Attempt': 1,
  'COMMUNITY SQL Injection Attempt': 1,
  'ET SCAN Potential SSH Scan': 2,
  'MALWARE-OTHER Win.Trojan.Generic': 1,
  'INDICATOR-SCAN PING BSD': 3,
  'PROTOCOL-SNMP Request Generic Attempt': 2,
  'ET POLICY Outbound Connection to Port 4444': 4,
  'MALWARE-CNC Win.Trojan.Agent Message': 1,
  'SERVER-WEBAPP Apache Struts RCE Attempt': 5,
  'ET EXPLOIT Possible Log4j Exploit Attempt': 5,
  'OS-WINDOWS Microsoft Exchange SSRF Attempt': 4,
  'SERVER-WEBAPP PHP CGI Argument Injection': 2,
  'ET SCAN Potential VNC Scan': 2,
  'MALWARE-OTHER Win.Trojan.GenericX Detection': 1,
  'INDICATOR-COMPROMISE DNS query to known malware C2': 5,
  'SERVER-WEBAPP Jenkins Script Console Attempt': 4,
  'OS-LINUX Linux.Worm.Mirai Activity': 3,
  'ET POLICY Cryptocurrency Mining Pool Connection': 2,
  'SERVER-WEBAPP Node.js Prototype Pollution Attempt': 3,
  'MALWARE-CNC Win.Trojan.Emotet C2 Communication': 5,
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weightedChoice(signatures) {
  const totalWeight = signatures.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;
  for (const sig of signatures) {
    random -= sig.weight;
    if (random <= 0) return sig.name;
  }
  return signatures[0].name;
}

function generateTimestamp(startMs, endMs) {
  const ts = new Date(startMs + Math.random() * (endMs - startMs));
  return ts.toISOString();
}

function generateRecord(id, startDate, endDate) {
  const srcIp =
    Math.random() < 0.3
      ? randomChoice(INTERNAL_IPS)
      : randomChoice(EXTERNAL_ATTACKER_IPS);
  const targetIp = randomChoice(INTERNAL_IPS);
  const signatureName = weightedChoice(SIGNATURES);

  return {
    timestamp: generateTimestamp(startDate, endDate),
    src_ip: srcIp,
    network_target_ip: targetIp,
    signature_name: signatureName,
    severity: SEVERITY_MAP[signatureName] || randomInt(1, 5),
  };
}

async function ensureIndex(client) {
  const exists = await client.indices.exists({ index: INDEX });
  if (!exists) {
    console.log(`Creating index "${INDEX}"...`);
    await client.indices.create({
      index: INDEX,
      body: {
        mappings: {
          properties: {
            timestamp: { type: 'date' },
            src_ip: { type: 'ip' },
            network_target_ip: { type: 'ip' },
            signature_name: { type: 'keyword' },
            severity: { type: 'integer' },
          },
        },
      },
    });
    console.log(`Index "${INDEX}" created.`);
  } else {
    console.log(`Index "${INDEX}" already exists.`);
  }
}

async function seedData() {
  const client = new Client({ node: ES_NODE });

  console.log(`Connecting to Elasticsearch at ${ES_NODE}...`);
  const health = await client.cluster.health();
  console.log(`Cluster status: ${health.status}`);

  await ensureIndex(client);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);

  console.log(`Generating ${TOTAL_RECORDS.toLocaleString()} records...`);
  console.log(
    `Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`,
  );

  let inserted = 0;
  const startTime = Date.now();

  for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
    const batchSize = Math.min(BATCH_SIZE, TOTAL_RECORDS - i);
    const operations = [];

    for (let j = 0; j < batchSize; j++) {
      operations.push({ index: { _index: INDEX } });
      operations.push(
        generateRecord(i + j, startDate.getTime(), endDate.getTime()),
      );
    }

    const response = await client.bulk({ body: operations, refresh: false });

    if (response.errors) {
      const failedItems = response.items.filter((item) => item.index?.error);
      console.error(
        `Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${failedItems.length} items failed`,
      );
      for (const item of failedItems.slice(0, 3)) {
        console.error('  Error:', item.index.error);
      }
    }

    inserted += batchSize;
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const rate = Math.round((inserted / (Date.now() - startTime)) * 1000);
    const progress = ((inserted / TOTAL_RECORDS) * 100).toFixed(1);
    process.stdout.write(
      `\r  Progress: ${progress}% (${inserted.toLocaleString()} / ${TOTAL_RECORDS.toLocaleString()}) - ${rate.toLocaleString()} rec/s - ${elapsed}s`,
    );
  }

  console.log('\n\nRefreshing index...');
  await client.indices.refresh({ index: INDEX });

  const count = await client.count({ index: INDEX });
  console.log(`Total documents in "${INDEX}": ${count.count.toLocaleString()}`);
  console.log(`Done in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
}

seedData().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
