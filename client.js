const { Readable } = require('stream');
const readline = require('readline');

function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}

async function main() {
  const startTime = Date.now();
  const response = await fetch('http://localhost:3000');
  const nodeStream = Readable.fromWeb(response.body);

  const rl = readline.createInterface({
    input: nodeStream,
    crlfDelay: Infinity,
  });

  let count = 0;
  let totalBytes = 0;

  for await (const line of rl) {
    totalBytes += Buffer.byteLength(line, 'utf8');
    count++;

    // Parse mas não guarda na memória
    JSON.parse(line);
  }

  const endTime = Date.now();
  const memory = process.memoryUsage();
  console.clear();

  console.log('\n📊 Benchmark (fetch stream):\n');
  console.log(`✅ Objetos recebidos: ${count}`);
  console.log(`📦 Dados totais: ${formatBytes(totalBytes)}`);
  console.log(`⏱️ Tempo total: ${endTime - startTime}ms`);
  console.log(`🧠 Memória usada (RSS): ${formatBytes(memory.rss)}`);
  console.log(`🧠 Memória heap usada: ${formatBytes(memory.heapUsed)}\n`);
}

main().catch(console.error);
