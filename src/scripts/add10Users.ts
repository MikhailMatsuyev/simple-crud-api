import http from 'http';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;

interface UserData {
    username: string;
    age: number;
    hobbies: string[];
}

function createUser(userData: UserData): Promise<void> {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(userData);

        const options = {
            hostname: 'localhost',
            port: PORT,
            path: '/api/users',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
            },
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 201) {
                    const user = JSON.parse(data);
                    console.log(`✅ User created: ${userData.username} (ID: ${user.id})`);
                    resolve();
                } else {
                    console.error(`❌ Error creating ${userData.username}: Status ${res.statusCode}`);
                    if (data) {
                        console.error(`Server response: ${data}`);
                    }
                    reject(new Error(`Failed to create user: ${userData.username}`));
                }
            });
        });

        req.on('error', (error) => {
            console.error(`❌ Request error for ${userData.username}:`, error.message);
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

async function createMultipleUsers(): Promise<void> {
    const users: UserData[] = [
        { username: 'Alice Johnson', age: 28, hobbies: ['reading', 'yoga', 'photography'] },
        { username: 'Bob Smith', age: 35, hobbies: ['coding', 'gaming', 'hiking'] },
        { username: 'Charlie Brown', age: 22, hobbies: ['music', 'drawing', 'cooking'] },
        { username: 'Diana Prince', age: 30, hobbies: ['swimming', 'running', 'traveling'] },
        { username: 'Ethan Hunt', age: 40, hobbies: ['skiing', 'climbing', 'martial arts'] },
        { username: 'Fiona Green', age: 26, hobbies: ['painting', 'gardening', 'baking'] },
        { username: 'George Miller', age: 33, hobbies: ['writing', 'chess', 'cycling'] },
        { username: 'Hannah Lee', age: 29, hobbies: ['dancing', 'singing', 'theater'] },
        { username: 'Ivan Petrov', age: 31, hobbies: ['fishing', 'camping', 'woodworking'] },
        { username: 'Julia Roberts', age: 27, hobbies: ['knitting', 'meditation', 'volleyball'] }
    ];

    console.log('🚀 Creating 10 users...');
    console.log('');

    try {
        for (const user of users) {
            await createUser(user);
            // Small delay between requests to avoid overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.log('');
        console.log('✅ All users created successfully!');
    } catch (error) {
        console.error('');
        console.error('❌ Error during user creation process');
        console.log('\n💡 Make sure the server is running on port', PORT);
        process.exit(1);
    }
}

createMultipleUsers();