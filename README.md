# Conclusão do Benchmark: Fetch Stream vs Fetch Completo (JSON)

Este documento apresenta os resultados do benchmark comparando duas abordagens para receber dados JSON grandes via HTTP em Node.js:

- **Fetch Stream**: recebendo dados no formato NDJSON e processando em streaming.
- **Fetch Completo**: recebendo o JSON completo de uma vez, desserializando com `JSON.parse()`.

---

## Dados Gerais

| Métrica                 | Fetch Stream (NDJSON) | Fetch Completo (JSON)  |
|-------------------------|-----------------------|-----------------------|
| Objetos recebidos       | 1000                  | 1000                  |
| Dados totais recebidos  | 97.72 MB              | 97.72 MB              |
| Tempo total / download  | 915 ms                | 842 ms (download) + 122 ms (desserialização) = 964 ms total |
| Memória RSS usada       | 99.83 MB              | 393.19 MB             |
| Memória heap usada      | 12.85 MB              | 201.94 MB             |

---

## Análise

### Tempo de Execução

- O tempo total para receber e processar os dados no modo streaming (NDJSON) foi de aproximadamente **915 ms**.
- O modo fetch completo levou um pouco mais, aproximadamente **964 ms** (842 ms para download + 122 ms para desserialização).
- A diferença de tempo total entre os métodos é pequena (~5%), mostrando que o streaming não prejudica o desempenho.

### Uso de Memória

- A redução na memória RSS utilizada foi de aproximadamente **74.6%** (de 393 MB para 99 MB).
- A redução no uso de heap foi ainda mais significativa, cerca de **94%** (de 201.94 MB para 12.85 MB).
- Esse ganho mostra que processar os dados em streaming é muito mais eficiente para a memória, especialmente a heap, que impacta diretamente a performance do Node.js.

### Consumo de Dados

- A quantidade de dados recebidos foi idêntica nos dois métodos: **~97.72 MB**, garantindo uma comparação justa.

---

## Cálculo do Ganho Percentual

Para cálculo da redução de memória RSS:

\[
\frac{393.19 - 99.83}{393.19} \times 100 \approx 74.6\%
\]

Para cálculo da redução de memória heap:

\[
\frac{201.94 - 12.85}{201.94} \times 100 \approx 93.6\%
\]

---

## Conclusão Final

- **Fetch streaming via NDJSON** permite processar grandes volumes de dados JSON de forma mais eficiente em termos de memória, sem impacto significativo no tempo total de processamento.
- Essa abordagem é ideal para aplicações que precisam lidar com grandes payloads JSON sem sobrecarregar a memória do servidor ou cliente.
- O uso de streaming também permite iniciar o processamento dos dados imediatamente, reduzindo a latência percebida.

---

## Próximos Passos

- Executar múltiplas iterações do benchmark para obter médias e desvios padrão.
- Testar com diferentes tamanhos de payload e configurações de rede.
- Integrar o benchmark em CI para monitorar regressões.

---

*Benchmark realizado em ambiente Node.js, servidor HTTP local, payload de 1000 objetos com ~100KB cada (~100MB total).*

---

Se desejar, consulte os scripts `client-fetch-full.js` e `client-fetch-stream.js` para detalhes da implementação.

---

# Obrigado!
