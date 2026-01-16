const employeesController = require('../../app/controllers/employeesController');
const Employee = require('../../app/model/Employee');

// Mock Employee model
jest.mock('../../app/model/Employee');

describe('Employees Controller', () => {
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

    describe('getAllEmployees', () => {
        it('should return all employees', async () => {
            const mockEmployees = [
                { _id: '1', firstname: 'John', lastname: 'Doe' },
                { _id: '2', firstname: 'Jane', lastname: 'Smith' }
            ];
            Employee.find = jest.fn().mockResolvedValue(mockEmployees);

            await employeesController.getAllEmployees(mockReq, mockRes);

            expect(Employee.find).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith(mockEmployees);
        });

        it('should return 204 when no employees found', async () => {
            Employee.find = jest.fn().mockResolvedValue(null);

            await employeesController.getAllEmployees(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'No employees found.' });
        });
    });

    describe('getEmployee', () => {
        it('should return employee by id', async () => {
            const mockEmployee = { _id: '1', firstname: 'John', lastname: 'Doe' };
            mockReq.params.id = '1';
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(mockEmployee)
            };
            Employee.findOne = jest.fn().mockReturnValue(mockQuery);

            await employeesController.getEmployee(mockReq, mockRes);

            expect(Employee.findOne).toHaveBeenCalledWith({ _id: '1' });
            expect(mockQuery.exec).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith(mockEmployee);
        });

        it('should return 400 when id is missing', async () => {
            mockReq.params.id = null;

            await employeesController.getEmployee(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'Employee ID required.' });
        });

        it('should return 204 when employee not found', async () => {
            mockReq.params.id = '999';
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(null)
            };
            Employee.findOne = jest.fn().mockReturnValue(mockQuery);

            await employeesController.getEmployee(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'No employee matches ID 999.' });
        });
    });

    describe('createNewEmployee', () => {
        it('should create a new employee', async () => {
            mockReq.body = { firstname: 'John', lastname: 'Doe' };
            const mockEmployee = { _id: '1', ...mockReq.body };
            Employee.create = jest.fn().mockResolvedValue(mockEmployee);

            await employeesController.createNewEmployee(mockReq, mockRes);

            expect(Employee.create).toHaveBeenCalledWith({
                firstname: 'John',
                lastname: 'Doe'
            });
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(mockEmployee);
        });

        it('should return 400 when firstname is missing', async () => {
            mockReq.body = { lastname: 'Doe' };

            await employeesController.createNewEmployee(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'First and last names are required' });
        });

        it('should return 400 when lastname is missing', async () => {
            mockReq.body = { firstname: 'John' };

            await employeesController.createNewEmployee(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'First and last names are required' });
        });
    });

    describe('updateEmployee', () => {
        it('should update an employee', async () => {
            const mockEmployee = {
                _id: '1',
                firstname: 'John',
                lastname: 'Doe',
                save: jest.fn().mockResolvedValue(true)
            };
            mockReq.body = { id: '1', firstname: 'Jane', lastname: 'Smith' };
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(mockEmployee)
            };
            Employee.findOne = jest.fn().mockReturnValue(mockQuery);

            await employeesController.updateEmployee(mockReq, mockRes);

            expect(Employee.findOne).toHaveBeenCalledWith({ _id: '1' });
            expect(mockQuery.exec).toHaveBeenCalled();
            expect(mockEmployee.firstname).toBe('Jane');
            expect(mockEmployee.lastname).toBe('Smith');
            expect(mockEmployee.save).toHaveBeenCalled();
        });

        it('should return 400 when id is missing', async () => {
            mockReq.body = { firstname: 'Jane' };

            await employeesController.updateEmployee(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'ID parameter is required.' });
        });

        it('should return 204 when employee not found', async () => {
            mockReq.body = { id: '999' };
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(null)
            };
            Employee.findOne = jest.fn().mockReturnValue(mockQuery);

            await employeesController.updateEmployee(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'No employee matches ID 999.' });
        });
    });

    describe('deleteEmployee', () => {
        it('should delete an employee', async () => {
            const mockEmployee = {
                _id: '1',
                deleteOne: jest.fn().mockResolvedValue({ acknowledged: true })
            };
            mockReq.body = { id: '1' };
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(mockEmployee)
            };
            Employee.findOne = jest.fn().mockReturnValue(mockQuery);

            await employeesController.deleteEmployee(mockReq, mockRes);

            expect(Employee.findOne).toHaveBeenCalledWith({ _id: '1' });
            expect(mockQuery.exec).toHaveBeenCalled();
            expect(mockEmployee.deleteOne).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalled();
        });

        it('should return 400 when id is missing', async () => {
            mockReq.body = {};

            await employeesController.deleteEmployee(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'Employee ID required.' });
        });

        it('should return 204 when employee not found', async () => {
            mockReq.body = { id: '999' };
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(null)
            };
            Employee.findOne = jest.fn().mockReturnValue(mockQuery);

            await employeesController.deleteEmployee(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.json).toHaveBeenCalledWith({ 'message': 'No employee matches ID 999.' });
        });
    });
});
