const registerController = require('../../app/controllers/registerController');
const User = require('../../app/model/User');
const bcrypt = require('bcrypt');

// Mock dependencies
jest.mock('../../app/model/User');
jest.mock('bcrypt');

describe('Register Controller', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {
            body: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            sendStatus: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    describe('handleNewUser', () => {
        it('should return 400 when username is missing', async () => {
            mockReq.body = { pwd: 'password123' };

            await registerController.handleNewUser(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'Username and password are required.' });
        });

        it('should return 400 when password is missing', async () => {
            mockReq.body = { user: 'testuser' };

            await registerController.handleNewUser(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'Username and password are required.' });
        });

        it('should return 409 when username already exists', async () => {
            const mockUser = { username: 'testuser' };
            mockReq.body = { user: 'testuser', pwd: 'password123' };
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(mockUser)
            };
            User.findOne = jest.fn().mockReturnValue(mockQuery);

            await registerController.handleNewUser(mockReq, mockRes);

            expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
            expect(mockQuery.exec).toHaveBeenCalled();
            expect(mockRes.sendStatus).toHaveBeenCalledWith(409);
        });

        it('should create a new user successfully', async () => {
            mockReq.body = { user: 'newuser', pwd: 'password123' };
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(null)
            };
            User.findOne = jest.fn().mockReturnValue(mockQuery);
            bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');
            const mockCreatedUser = { username: 'newuser', password: 'hashedpassword' };
            User.create = jest.fn().mockResolvedValue(mockCreatedUser);

            await registerController.handleNewUser(mockReq, mockRes);

            expect(User.findOne).toHaveBeenCalledWith({ username: 'newuser' });
            expect(mockQuery.exec).toHaveBeenCalled();
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(User.create).toHaveBeenCalledWith({
                username: 'newuser',
                password: 'hashedpassword'
            });
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({ 'success': 'New user newuser created!' });
        });

        it('should return 500 when user creation fails', async () => {
            mockReq.body = { user: 'newuser', pwd: 'password123' };
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(null)
            };
            User.findOne = jest.fn().mockReturnValue(mockQuery);
            bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');
            User.create = jest.fn().mockRejectedValue(new Error('Database error'));

            await registerController.handleNewUser(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'Database error' });
        });
    });
});
