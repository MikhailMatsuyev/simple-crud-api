import { createServer } from 'http';
import { handleRequest } from '../src/app';
import { clearUsers } from '../src/controllers/usersController';

const PORT = 4001;
const BASE_URL = `http://localhost:${PORT}/api/users`;

const server = createServer(handleRequest);

beforeAll((done) => {
  server.listen(PORT, done);
});

afterAll((done) => {
  server.close(done);
});

beforeEach(() => {
  clearUsers();
});

const makeRequest = (method: string, url: string, data?: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: url,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = require('http').request(options, (res: any) => {
      let body = '';

      res.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: body ? JSON.parse(body) : null,
        });
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
};

describe('CRUD API', () => {
  test('Scenario 1: Complete user lifecycle', async () => {
    // Get all users (empty array)
    let response = await makeRequest('GET', '/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);

    // Create new user
    const newUser = {
      username: 'John Doe',
      age: 30,
      hobbies: ['reading', 'swimming'],
    };

    response = await makeRequest('POST', '/api/users', newUser);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newUser);
    expect(response.body.id).toBeDefined();

    const userId = response.body.id;

    // Get created user by ID
    response = await makeRequest('GET', `/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(userId);
    expect(response.body.username).toBe('John Doe');

    // Update the user
    const updatedUser = {
      username: 'John Smith',
      age: 31,
      hobbies: ['reading', 'swimming', 'coding'],
    };

    response = await makeRequest('PUT', `/api/users/${userId}`, updatedUser);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(updatedUser);

    // Delete the user
    response = await makeRequest('DELETE', `/api/users/${userId}`);
    expect(response.status).toBe(204);

    // Try to get deleted user
    response = await makeRequest('GET', `/api/users/${userId}`);
    expect(response.status).toBe(404);
  });

  test('Scenario 2: Invalid user ID handling', async () => {
    const response = await makeRequest('GET', '/api/users/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid user ID');
  });

  test('Scenario 3: Invalid user data validation', async () => {
    const invalidUser = {
      username: '', // Invalid: empty string
      age: -5, // Invalid: negative age
      hobbies: 'not-an-array', // Invalid: not an array
    };

    const response = await makeRequest('POST', '/api/users', invalidUser);
    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  test('Scenario 4: Non-existing endpoint', async () => {
    const response = await makeRequest('GET', '/api/non-existing');
    expect(response.status).toBe(404);
    expect(response.body.message).toContain('Endpoint not found');
  });
});