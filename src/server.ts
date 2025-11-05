import { createServer } from 'http';
import { handleRequest } from './app';

const PORT = process.env.PORT || 4000;

const server = createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on('error', (error: Error) => {
  console.error('Server error:', error);
});

export default server;