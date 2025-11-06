import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

function listUsers(): void {
    const options = {
        hostname: 'localhost',
        port: PORT,
        path: '/api/users',
        method: 'GET',
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                const users = JSON.parse(data);
                console.log('📋 Users in database:');
                console.log(JSON.stringify(users, null, 2));
                console.log(`\nTotal users: ${users.length}`);
            } else {
                console.error('❌ Error fetching users:', data);
            }
        });
    });

    req.on('error', (error) => {
        console.error('Request error:', error.message);
    });

    req.end();
}

listUsers();