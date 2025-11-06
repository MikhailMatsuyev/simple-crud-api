import { createServer } from 'http';
import { handleRequest } from '../src/app';
import { clearUsers } from '../src/controllers/usersController';

const PORT = 4001;
const server = createServer(handleRequest);

// Вспомогательная функция для HTTP запросов
const makeRequest = (
    method: string,
    path: string,
    data?: any
): Promise<{ status: number; body: any }> => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: path,
            method: method,
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

        req.on('error', (err: Error) => {
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
};

beforeAll((done) => {
    server.listen(PORT, () => {
        console.log(`Test server running on port ${PORT}`);
        done();
    });
});

afterAll((done) => {
    server.close(() => {
        console.log('Test server closed');
        done();
    });
});

beforeEach(() => {
    clearUsers();
});

describe('CRUD API Integration Tests', () => {
    describe('Scenario 1: Complete user lifecycle', () => {
        test('GET /api/users should return empty array initially', async () => {
            const response = await makeRequest('GET', '/api/users');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        test('POST /api/users should create a new user', async () => {
            const newUser = {
                username: 'John Doe',
                age: 30,
                hobbies: ['reading', 'swimming'],
            };

            const response = await makeRequest('POST', '/api/users', newUser);
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(newUser);
            expect(response.body.id).toBeDefined();
            expect(typeof response.body.id).toBe('string');
        });

        test('GET /api/users/{userId} should return created user', async () => {
            // First create a user
            const newUser = {
                username: 'John Doe',
                age: 30,
                hobbies: ['reading', 'swimming'],
            };

            const createResponse = await makeRequest('POST', '/api/users', newUser);
            const userId = createResponse.body.id;

            // Then get the user by ID
            const getResponse = await makeRequest('GET', `/api/users/${userId}`);
            expect(getResponse.status).toBe(200);
            expect(getResponse.body.id).toBe(userId);
            expect(getResponse.body.username).toBe('John Doe');
            expect(getResponse.body.age).toBe(30);
            expect(getResponse.body.hobbies).toEqual(['reading', 'swimming']);
        });

        test('PUT /api/users/{userId} should update the user', async () => {
            // First create a user
            const newUser = {
                username: 'John Doe',
                age: 30,
                hobbies: ['reading', 'swimming'],
            };

            const createResponse = await makeRequest('POST', '/api/users', newUser);
            const userId = createResponse.body.id;

            // Then update the user
            const updatedUser = {
                username: 'John Smith',
                age: 31,
                hobbies: ['reading', 'swimming', 'coding'],
            };

            const updateResponse = await makeRequest('PUT', `/api/users/${userId}`, updatedUser);
            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body).toMatchObject(updatedUser);
            expect(updateResponse.body.id).toBe(userId);
        });

        test('DELETE /api/users/{userId} should delete the user', async () => {
            // First create a user
            const newUser = {
                username: 'John Doe',
                age: 30,
                hobbies: ['reading', 'swimming'],
            };

            const createResponse = await makeRequest('POST', '/api/users', newUser);
            const userId = createResponse.body.id;

            // Then delete the user
            const deleteResponse = await makeRequest('DELETE', `/api/users/${userId}`);
            expect(deleteResponse.status).toBe(204);
            expect(deleteResponse.body).toBeNull();
        });

        test('GET /api/users/{userId} should return 404 after deletion', async () => {
            // First create and then delete a user
            const newUser = {
                username: 'John Doe',
                age: 30,
                hobbies: ['reading', 'swimming'],
            };

            const createResponse = await makeRequest('POST', '/api/users', newUser);
            const userId = createResponse.body.id;
            await makeRequest('DELETE', `/api/users/${userId}`);

            // Then try to get the deleted user
            const getResponse = await makeRequest('GET', `/api/users/${userId}`);
            expect(getResponse.status).toBe(404);
            expect(getResponse.body.message).toContain('User not found');
        });
    });

    describe('Scenario 2: Error handling', () => {
        test('GET /api/users/{invalidId} should return 400 for invalid UUID', async () => {
            const response = await makeRequest('GET', '/api/users/invalid-id');
            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Invalid user ID');
        });

        test('POST /api/users should return 400 for invalid data', async () => {
            const invalidUser = {
                username: '', // Invalid: empty string
                age: -5, // Invalid: negative age
                hobbies: 'not-an-array', // Invalid: not an array
            };

            const response = await makeRequest('POST', '/api/users', invalidUser);
            expect(response.status).toBe(400);
            expect(response.body.message).toBeDefined();
        });

        test('GET non-existing endpoint should return 404', async () => {
            const response = await makeRequest('GET', '/api/non-existing');
            expect(response.status).toBe(404);
            expect(response.body.message).toContain('Endpoint not found');
        });
    });
});