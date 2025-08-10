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
  const fetchStart = Date.now();
  const response = await fetch('http://localhost:3000?mode=json');

  const raw = await response.text(); // mede só o tempo de download
  const fetchEnd = Date.now();

  const deserializeStart = Date.now();
  const parsed = JSON.parse(raw); // mede só o tempo de desserialização
  const deserializeEnd = Date.now();

  const totalBytes = Buffer.byteLength(raw, 'utf8');
  const count = parsed.length;
  const memory = process.memoryUsage();
  console.clear();

  console.log('\n📊 Benchmark (fetch completo):\n');
  console.log(`✅ Objetos recebidos: ${count}`);
  console.log(`📦 Dados totais: ${formatBytes(totalBytes)}`);
  console.log(`⏱️ Tempo de download: ${fetchEnd - fetchStart}ms`);
  console.log(`🧠 Tempo de desserialização: ${deserializeEnd - deserializeStart}ms`);
  console.log(`🧠 Memória usada (RSS): ${formatBytes(memory.rss)}`);
  console.log(`🧠 Memória heap usada: ${formatBytes(memory.heapUsed)}\n`);
}

main().catch(console.error);
