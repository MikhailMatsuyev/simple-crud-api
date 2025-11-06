import http from 'http';

const args = process.argv.slice(2);

if (args.length < 2) {
    console.error('Usage: npm run update-user <userId> <jsonData>');
    console.error('Example: npm run update-user -- "550e8400-e29b-41d4-a716-446655440000" \'{"username": "updatedName", "age": 35, "hobbies": ["reading", "coding"]}\'');
    process.exit(1);
}

const userId = args[0];
const jsonData = args[1];

// Validate UUID format (simple check)
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!uuidRegex.test(userId)) {
    console.error('Error: Invalid user ID format. Must be a valid UUID.');
    process.exit(1);
}

let updateData;
try {
    updateData = JSON.parse(jsonData);
} catch (error) {
    console.error('Error: Invalid JSON data');
    console.error('Please provide valid JSON string');
    process.exit(1);
}

// Validate required fields
if (!updateData.username || !updateData.age || !Array.isArray(updateData.hobbies)) {
    console.error('Error: User data must include username (string), age (number), and hobbies (array)');
    process.exit(1);
}

const port = process.env.PORT || 4000;
const options = {
    hostname: 'localhost',
    port: port,
    path: `/api/users/${userId}`,
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
};

console.log(`Updating user  ${userId}...`);
console.log('Update data:', updateData);

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const response = data ? JSON.parse(data) : null;

            if (res.statusCode === 200) {
                console.log('✅ User updated successfully:');
                console.log(JSON.stringify(response, null, 2));
            } else if (res.statusCode === 400) {
                console.error('❌ Error: Invalid user ID format');
                console.error('Message:', response.message);
            } else if (res.statusCode === 404) {
                console.error('❌ Error: User not found');
                console.error('Message:', response.message);
            } else {
                console.error(`❌ Error: ${res.statusCode}`);
                console.error('Response:', response);
            }
        } catch (error) {
            console.error('Error parsing response:', error);
        }
    });
});

req.on('error', (error) => {
    console.error('Request failed:', error.message);
    console.log('💡 Make sure the server is running on port', port);
});

req.write(JSON.stringify(updateData));
req.end();