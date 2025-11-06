import { IncomingMessage, ServerResponse } from 'http';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/usersController';

export const handleUsersRoute = (req: IncomingMessage, res: ServerResponse): void => {
    const { method, url } = req;

    res.setHeader('Content-Type', 'application/json');

    // Parse URL to get user ID if present
    const urlParts: string[] = url?.split('/') || [];
    const userId: string = urlParts[3]; // ['', 'api', 'users', 'userId']

    // GET /api/users
    if (method === 'GET' && url === '/api/users') {
        try {
            const users = getAllUsers();
            res.statusCode = 200;
            res.end(JSON.stringify(users));
        } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
        return;
    }

    // GET /api/users/{userId}
    if (method === 'GET' && userId) {
        try {
            const { user, error } = getUserById(userId);

            if (error) {
                res.statusCode = error === 'Invalid user ID' ? 400 : 404;
                res.end(JSON.stringify({ message: error }));
                return;
            }

            res.statusCode = 200;
            res.end(JSON.stringify(user));
        } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
        return;
    }

    // POST /api/users
    if (method === 'POST' && url === '/api/users') {
        let body = '';

        req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                if (!body) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ message: 'Request body is required' }));
                    return;
                }

                const userData = JSON.parse(body);
                const { user, error } = createUser(userData);

                if (error) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ message: error }));
                    return;
                }

                res.statusCode = 201;
                res.end(JSON.stringify(user));
            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({ message: 'Invalid JSON format' }));
            }
        });
        return;
    }

    // PUT /api/users/{userId}
    if (method === 'PUT' && userId) {
        let body = '';

        req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                if (!body) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ message: 'Request body is required' }));
                    return;
                }

                const userData = JSON.parse(body);
                const { user, error } = updateUser(userId, userData);

                if (error) {
                    res.statusCode = error === 'Invalid user ID' ? 400 : 404;
                    res.end(JSON.stringify({ message: error }));
                    return;
                }

                res.statusCode = 200;
                res.end(JSON.stringify(user));
            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({ message: 'Invalid JSON format' }));
            }
        });
        return;
    }

    // DELETE /api/users/{userId}
    if (method === 'DELETE' && userId) {
        try {
            const { success, error } = deleteUser(userId);

            if (error) {
                res.statusCode = error === 'Invalid user ID' ? 400 : 404;
                res.end(JSON.stringify({ message: error }));
                return;
            }

            res.statusCode = 204;
            res.end();
        } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
        return;
    }

    // If no specific route matches
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Endpoint not found' }));
};