# Simple CRUD API

A simple RESTful CRUD API built with Node.js and TypeScript for managing user data.

## Features

- Create, Read, Update, and Delete users
- In-memory data storage
- UUID-based user identification
- Input validation
- TypeScript support

## Installation
```bash
npm install
```

## Usage

1 После установки зависимостей нужно запустить проект командой из package.json
"start:dev": "ts-node-dev src/server.ts"
в консоли должно появиться сообщение Server is running on port 4000

2 Можно создать 10 тестовых пользователей командой из package.json
"add-10-users": "ts-node src/scripts/add10Users.ts",
в консоли увидим ✅ All users created successfully!

3 Проверить список всех пользователей можно там же "list-users": "ts-node src/scripts/listUsers.ts",

4 Чтобы получить заготовку для удаления юзера нужно там же вызвать команду
"delete-user": "ts-node src/scripts/deleteUser.ts"

В консоли появится сообщение Example: npm run delete-user -- "550e8400-e29b-41d4-a716-446655440000"
Нужно взять из списка всех юзеров его id  "6fa65bb5-cce3-4381-ae56-dd92a40007bd" и
подставить в шаблон удаления из команды выше (в терминале) 
Те в консоли сформировать такую строчку:    npm run delete-user -- "6fa65bb5-cce3-4381-ae56-dd92a40007bd"

Проверить правильность удаления можно командой "list-users": "ts-node src/scripts/listUsers.ts",

Для обновления данных юзера такая же процедура как и для удаления





### Start the server
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

Server will run on `http://localhost:4000` (or port specified in `.env`)

## API Endpoints

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update user by ID
- `DELETE /api/users/:id` - Delete user by ID

### User Object Structure
```json
{
  "username": "string",
  "age": "number",
  "hobbies": ["string"]
}
```

## Scripts

### Add a user
```bash
npm run add-user -- "John Doe" 25 reading coding swimming
```

### Add 10 users at once
```bash
npm run add-10-users
```

### List all users
```bash
npm run list-users
```

### Delete a user
```bash
npm run delete-user -- <userId>
```

## Environment Variables

Create a `.env` file in the root directory:
```
PORT=4000
```

## Technologies

- Node.js
- TypeScript
- UUID
- dotenv

## License

MIT