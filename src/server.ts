import { createServer } from 'http';
import { handleRequest } from './app';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 3000;

const server = createServer(handleRequest);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});