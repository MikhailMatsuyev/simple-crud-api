import http from 'http';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;

function deleteUser(userId: string): void {
    const options = {
        hostname: 'localhost',
        port: PORT,
        path: `/api/users/${userId}`,
        method: 'DELETE',
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 204) {
                console.log('✅ User deleted successfully (status 204)');
            } else if (res.statusCode === 400) {
                console.error('❌ Error: Invalid user ID (not UUID)');
                if (data) {
                    console.error(`Server response: ${data}`);
                }
            } else if (res.statusCode === 404) {
                console.error('❌ Error: User not found');
                if (data) {
                    console.error(`Server response: ${data}`);
                }
            } else {
                console.error(`❌ Unexpected error: Status ${res.statusCode}`);
                if (data) {
                    console.error(`Server response: ${data}`);
                }
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Request error:');
        console.error(error.message);
        console.log('\n💡 Make sure the server is running on port', PORT);
    });

    req.end();
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 1) {
    console.log('Usage: npm run delete-user -- <userId>');
    console.log('Example: npm run delete-user -- "550e8400-e29b-41d4-a716-446655440000"');
    console.log('Note: Server must be running on port', PORT);
    process.exit(1);
}

const userId = args[0];

// Basic UUID validation (simple version)
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!uuidRegex.test(userId)) {
    console.error('❌ Error: User ID must be a valid UUID');
    console.error('Example: 550e8400-e29b-41d4-a716-446655440000');
    process.exit(1);
}

console.log('🗑️  Deleting user...');
console.log(`User ID: ${userId}`);
console.log('');

deleteUser(userId);