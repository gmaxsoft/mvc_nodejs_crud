// Test setup file
process.env.NODE_ENV = 'test';
process.env.ACCESS_TOKEN_SECRET = 'test_access_token_secret';
process.env.REFRESH_TOKEN_SECRET = 'test_refresh_token_secret';
process.env.DATABASE_URI = 'mongodb://localhost:27017/test_db';
process.env.PORT = 3500;

// Fix for jsonwebtoken in test environment
if (typeof global.Buffer === 'undefined') {
    global.Buffer = require('buffer').Buffer;
}
