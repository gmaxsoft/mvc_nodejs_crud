# Node.js MVC CRUD Application

A CRUD (Create, Read, Update, Delete) application built using the MVC (Model-View-Controller) architecture with Node.js, Express.js, and MongoDB. The project includes a complete JWT authentication system, user roles, and RESTful API.

## 🚀 Features

- ✅ **CRUD Operations** - Full data operations (employees, users)
- ✅ **JWT Authentication** - Secure authentication with JWT tokens
- ✅ **Role-Based Access Control (RBAC)** - User role system (Admin, Editor, User)
- ✅ **Refresh Tokens** - Token refresh via cookies
- ✅ **Password Hashing** - Password hashing with bcrypt
- ✅ **CORS Support** - Cross-Origin Resource Sharing configuration
- ✅ **Error Handling** - Centralized error handling
- ✅ **Request Logging** - HTTP request logging
- ✅ **MongoDB Integration** - MongoDB integration via Mongoose

## 📋 Requirements

- Node.js (version 20.x)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🛠️ Technologies

- **Backend Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcrypt
- **Environment Variables:** dotenv
- **CORS:** cors
- **Cookies:** cookie-parser
- **Utilities:** uuid, date-fns

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/gmaxsoft/mvc_nodejs_crud.git
cd mvc_nodejs_crud
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the project root directory and add the following variables:

```env
PORT=3500
DATABASE_URI=mongodb://localhost:27017/database_name
# or for MongoDB Atlas:
# DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Secret (generate a secure random string)
ACCESS_TOKEN_SECRET=your_secret_key_for_access_token
REFRESH_TOKEN_SECRET=your_secret_key_for_refresh_token
```

4. **Start the server**

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

The server will be available at: `http://localhost:3500`

## 📁 Project Structure

```
mvc_nodejs_crud/
├── app/
│   ├── controllers/          # Controllers (business logic)
│   │   ├── authController.js
│   │   ├── employeesController.js
│   │   ├── logoutController.js
│   │   ├── refreshTokenController.js
│   │   ├── registerController.js
│   │   └── usersController.js
│   ├── middleware/           # Middleware
│   │   ├── credentials.js
│   │   ├── errorHandler.js
│   │   ├── logEvents.js
│   │   ├── verifyJWT.js
│   │   └── verifyRoles.js
│   ├── model/               # Data models
│   │   ├── Employee.js
│   │   ├── User.js
│   │   ├── employees.json
│   │   └── users.json
│   ├── routes/              # Route definitions
│   │   ├── api/
│   │   │   ├── employees.js
│   │   │   └── users.js
│   │   ├── auth.js
│   │   ├── logout.js
│   │   ├── refresh.js
│   │   ├── register.js
│   │   └── root.js
│   └── views/               # HTML views
│       ├── 404.html
│       └── index.html
├── config/                  # Configuration
│   ├── allowedOrigins.js
│   ├── corsOptions.js
│   ├── dbConn.js
│   └── roles_list.js
├── public/                  # Static files
│   └── assets/
│       ├── css/
│       └── js/
├── tests/                   # Unit tests
│   ├── controllers/
│   └── setup.js
├── server.js                # Main server file
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication (Public)

- `POST /register` - Register a new user
- `POST /auth` - Login (returns access token and refresh token)
- `GET /refresh` - Refresh access token
- `POST /logout` - Logout

### Employees (Requires JWT)

- `GET /employees` - Get all employees
- `GET /employees/:id` - Get employee by ID
- `POST /employees` - Create new employee (Admin, Editor)
- `PUT /employees` - Update employee (Admin, Editor)
- `DELETE /employees` - Delete employee (Admin)

### Users (Requires JWT)

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users` - Update user
- `DELETE /users` - Delete user

## 🔐 User Roles

- **Admin** - Full access to all operations
- **Editor** - Can create and edit, but cannot delete
- **User** - Read-only access to data

## 📝 API Usage Examples

### User Registration

```bash
POST /register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123",
  "roles": ["User"]
}
```

### Login

```bash
POST /auth
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

Response contains:
- `accessToken` - Access token (short lifetime)
- `refreshToken` - Refresh token (longer lifetime, stored in cookie)

### Get Employees (with token)

```bash
GET /employees
Authorization: Bearer <access_token>
```

### Create Employee (Admin/Editor)

```bash
POST /employees
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstname": "John",
  "lastname": "Doe",
  "position": "Developer"
}
```

## 🧪 Testing

Run unit tests with:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens with digital signature
- Refresh tokens stored in secure cookies
- Role-based access control (RBAC)
- CORS configured for secure requests
- Input data validation

## 🐛 Troubleshooting

### MongoDB Connection Issues

Make sure:
- MongoDB is running locally or you have access to MongoDB Atlas
- `DATABASE_URI` in the `.env` file is correctly configured
- You have appropriate database permissions

### Authentication Errors

- Check if the JWT token is correctly sent in the `Authorization` header
- Make sure the token has not expired
- Verify that the user has the appropriate roles to perform the operation

## 📄 License

This project is licensed under the GPL-3.0-only license.

## 👤 Author

Maxsoft - Project created as an example of an MVC application in Node.js.

## ⭐ Acknowledgments

If this project is useful to you, consider giving it a star ⭐!
