// Mock jsonwebtoken before requiring authController
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}));

const authController = require('../../app/controllers/authController');
const User = require('../../app/model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../app/model/User');
jest.mock('bcrypt');

describe('Auth Controller', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {
            body: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            sendStatus: jest.fn().mockReturnThis(),
            cookie: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    describe('handleLogin', () => {
        it('should return 400 when username is missing', async () => {
            mockReq.body = { pwd: 'password123' };

            await authController.handleLogin(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'Username and password are required.' });
        });

        it('should return 400 when password is missing', async () => {
            mockReq.body = { user: 'testuser' };

            await authController.handleLogin(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'Username and password are required.' });
        });

        it('should return 401 when user not found', async () => {
            mockReq.body = { user: 'testuser', pwd: 'password123' };
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(null)
            };
            User.findOne = jest.fn().mockReturnValue(mockQuery);

            await authController.handleLogin(mockReq, mockRes);

            expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
            expect(mockQuery.exec).toHaveBeenCalled();
            expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
        });

        it('should return 401 when password is incorrect', async () => {
            const mockUser = {
                username: 'testuser',
                password: 'hashedpassword',
                roles: { User: 2001 },
                save: jest.fn().mockResolvedValue(true)
            };
            mockReq.body = { user: 'testuser', pwd: 'wrongpassword' };
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(mockUser)
            };
            User.findOne = jest.fn().mockReturnValue(mockQuery);
            bcrypt.compare = jest.fn().mockResolvedValue(false);

            await authController.handleLogin(mockReq, mockRes);

            expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
            expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
        });

        it('should login successfully with correct credentials', async () => {
            const mockUser = {
                username: 'testuser',
                password: 'hashedpassword',
                roles: { User: 2001, Admin: 5150 },
                refreshToken: '',
                save: jest.fn().mockResolvedValue(true)
            };
            mockReq.body = { user: 'testuser', pwd: 'password123' };
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(mockUser)
            };
            User.findOne = jest.fn().mockReturnValue(mockQuery);
            bcrypt.compare = jest.fn().mockResolvedValue(true);
            jwt.sign = jest.fn()
                .mockReturnValueOnce('access_token')
                .mockReturnValueOnce('refresh_token');

            await authController.handleLogin(mockReq, mockRes);

            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
            expect(jwt.sign).toHaveBeenCalledTimes(2);
            expect(mockUser.refreshToken).toBe('refresh_token');
            expect(mockUser.save).toHaveBeenCalled();
            expect(mockRes.cookie).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith({
                roles: [2001, 5150],
                accessToken: 'access_token'
            });
        });
    });
});
