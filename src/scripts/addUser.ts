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

function addUser(username: string, age: number, hobbies: string[]): void {
    const userData: UserData = {
        username,
        age,
        hobbies
    };

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
                console.log('✅ User added successfully:');
                console.log(JSON.stringify(JSON.parse(data), null, 2));
            } else {
                console.error('❌ Error adding user:');
                console.error(`Status: ${res.statusCode}`);
                console.error(`Response: ${data}`);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Request error:');
        console.error(error.message);
        console.log('\n💡 Make sure the server is running on port', PORT);
    });

    req.write(postData);
    req.end();
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 3) {
    console.log('Usage: npm run add-user -- <username> <age> <hobbies...>');
    console.log('Example: npm run add-user -- "John Doe" 25 reading coding swimming');
    console.log('Note: Server must be running on port', PORT);
    process.exit(1);
}

const username = args[0];
const age = parseInt(args[1]);

if (isNaN(age)) {
    console.error('❌ Age must be a number');
    process.exit(1);
}

const hobbies = args.slice(2);

console.log('📤 Adding user...');
console.log(`Username: ${username}`);
console.log(`Age: ${age}`);
console.log(`Hobbies: ${hobbies.join(', ')}`);
console.log('');

addUser(username, age, hobbies);