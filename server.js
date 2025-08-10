const http = require('http');
const url = require('url');

const createBigJson = (id) => ({
  id,
  timestamp: new Date().toISOString(),
  payload: 'x'.repeat(100 * 1024), // ~100KB por item
});

const server = http.createServer((req, res) => {
  const { query } = url.parse(req.url, true);
  const mode = query.mode || 'ndjson'; // padrão: ndjson

  const totalItems = 1000 * 3;
  const dataList = [];

  if (mode === 'json') {
    for (let i = 0; i < totalItems; i++) {
      dataList.push(createBigJson(i));
    }

    const json = JSON.stringify(dataList);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(json);
    console.log(`🟢 Enviado JSON completo com ${totalItems} objetos`);
  } else {
    res.writeHead(200, {
      'Content-Type': 'application/x-ndjson',
      'Transfer-Encoding': 'chunked',
    });

    let count = 0;
    const start = Date.now();

    const sendNext = () => {
      if (count >= totalItems) {
        const duration = Date.now() - start;
        console.log(`🟢 NDJSON enviado em ${duration}ms`);
        res.end();
        return;
      }

      const data = createBigJson(count);
      res.write(JSON.stringify(data) + '\n');
      count++;

      setImmediate(sendNext); // sem delay
    };

    sendNext();
  }
});

server.listen(3000, () => {
  console.log('🚀 Servidor em http://localhost:3000');
  console.log('➡️ Use ?mode=ndjson ou ?mode=json');
});
