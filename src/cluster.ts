import { createServer } from 'http';
import cluster from 'cluster';
import { handleRequest } from './app';
import * as os from "node:os";

const PORT = parseInt(process.env.PORT || '4000');
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Starting ${numCPUs - 1} workers`);

  // Create workers
  for (let i = 1; i < numCPUs; i++) {
    const workerPort = PORT + i;
    cluster.fork({ WORKER_PORT: workerPort.toString() });
  }

  // Load balancer server
  const loadBalancer = createServer((req, res) => {
    const workers = Object.values(cluster.workers || {});
    if (workers.length === 0) {
      res.statusCode = 503;
      res.end('No workers available');
      return;
    }

    // Round-robin load balancing
    const worker = workers[0]; // Simplified - in real scenario, you'd rotate
    // For actual round-robin, you'd need to implement proxy logic
    // This is a simplified version
    
    const options = {
      hostname: 'localhost',
      port: PORT + 1, // First worker port
      path: req.url,
      method: req.method,
      headers: req.headers
    };

    const proxyReq = require('http').request(options, (proxyRes: any) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err: Error) => {
      res.statusCode = 500;
      res.end(`Proxy error: ${err.message}`);
    });

    req.pipe(proxyReq);
  });

  loadBalancer.listen(PORT, () => {
    console.log(`Load balancer running on port ${PORT}`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const workerPort = parseInt(process.env.WORKER_PORT || (PORT + 1).toString());
  const server = createServer(handleRequest);

  server.listen(workerPort, () => {
    console.log(`Worker ${process.pid} is running on port ${workerPort}`);
  });
}