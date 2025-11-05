import { IncomingMessage, ServerResponse } from 'http';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/usersController';

export const handleUsersRoute = (req: IncomingMessage, res: ServerResponse): void => {
  const { method, url } = req;
  const urlParts = url?.split('/') || [];
  const userId = urlParts[3];

  res.setHeader('Content-Type', 'application/json');

  if (method === 'GET' && url === '/api/users') {
    const users = getAllUsers();
    res.statusCode = 200;
    res.end(JSON.stringify(users));
    return;
  }

  if (method === 'GET' && userId) {
    const { user, error } = getUserById(userId);
    
    if (error) {
      res.statusCode = error === 'Invalid user ID' ? 400 : 404;
      res.end(JSON.stringify({ message: error }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(user));
    return;
  }

  if (method === 'POST' && url === '/api/users') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
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
        res.end(JSON.stringify({ message: 'Invalid JSON' }));
      }
    });
    return;
  }

  if (method === 'PUT' && userId) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
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
        res.end(JSON.stringify({ message: 'Invalid JSON' }));
      }
    });
    return;
  }

  if (method === 'DELETE' && userId) {
    const { success, error } = deleteUser(userId);

    if (error) {
      res.statusCode = error === 'Invalid user ID' ? 400 : 404;
      res.end(JSON.stringify({ message: error }));
      return;
    }

    res.statusCode = 204;
    res.end();
    return;
  }

  // If no route matches
  res.statusCode = 404;
  res.end(JSON.stringify({ message: 'Endpoint not found' }));
};