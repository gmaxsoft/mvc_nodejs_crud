const usersController = require('../../app/controllers/usersController');
const User = require('../../app/model/User');

// Mock User model
jest.mock('../../app/model/User');

describe('Users Controller', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            sendStatus: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [
                { _id: '1', username: 'user1', roles: { User: 2001 } },
                { _id: '2', username: 'user2', roles: { User: 2001 } }
            ];
            User.find = jest.fn().mockResolvedValue(mockUsers);

            await usersController.getAllUsers(mockReq, mockRes);

            expect(User.find).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
        });

        it('should return 204 when no users found', async () => {
            User.find = jest.fn().mockResolvedValue(null);

            await usersController.getAllUsers(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'No users found' });
        });
    });

    describe('getUser', () => {
        it('should return user by id', async () => {
            const mockUser = { _id: '1', username: 'user1', roles: { User: 2001 } };
            mockReq.params.id = '1';
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(mockUser)
            };
            User.findOne = jest.fn().mockReturnValue(mockQuery);

            await usersController.getUser(mockReq, mockRes);

            expect(User.findOne).toHaveBeenCalledWith({ _id: '1' });
            expect(mockQuery.exec).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith(mockUser);
        });

        it('should return 400 when id is missing', async () => {
            mockReq.params.id = null;

            await usersController.getUser(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'User ID required' });
        });

        it('should return 204 when user not found', async () => {
            mockReq.params.id = '999';
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(null)
            };
            User.findOne = jest.fn().mockReturnValue(mockQuery);

            await usersController.getUser(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'User ID 999 not found' });
        });
    });

    describe('deleteUser', () => {
        it('should delete a user', async () => {
            const mockUser = {
                _id: '1',
                deleteOne: jest.fn().mockResolvedValue({ acknowledged: true })
            };
            mockReq.body = { id: '1' };
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(mockUser)
            };
            User.findOne = jest.fn().mockReturnValue(mockQuery);

            await usersController.deleteUser(mockReq, mockRes);

            expect(User.findOne).toHaveBeenCalledWith({ _id: '1' });
            expect(mockQuery.exec).toHaveBeenCalled();
            expect(mockUser.deleteOne).toHaveBeenCalledWith({ _id: '1' });
            expect(mockRes.json).toHaveBeenCalled();
        });

        it('should return 400 when id is missing', async () => {
            mockReq.body = {};

            await usersController.deleteUser(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'User ID required' });
        });

        it('should return 204 when user not found', async () => {
            mockReq.body = { id: '999' };
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(null)
            };
            User.findOne = jest.fn().mockReturnValue(mockQuery);

            await usersController.deleteUser(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'User ID 999 not found' });
        });
    });
});
