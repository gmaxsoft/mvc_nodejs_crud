require('dotenv').config();
const PORT = process.env.PORT || 3500; //choose port

const express = require('express');
const app = express();

const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const corsOptions = require('./config/corsOptions');
const { logger } = require('./app/middleware/logEvents');
const errorHandler = require('./app/middleware/errorHandler');
const verifyJWT = require('./app/middleware/verifyJWT');
const credentials = require('./app/middleware/credentials');

const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

/* Connect to Database */
connectDB();

/* Our logger */
app.use(logger);

/* Handle options credentials check and fetch cookies credentials requirement */
app.use(credentials);

/* Cross Origin Resource Sharing */
app.use(cors(corsOptions));

/* built-in middleware to handle urlencoded form data */
app.use(express.urlencoded({ extended: false }));

/* built-in middleware for json */ 
app.use(express.json());

/* middleware for cookies */
app.use(cookieParser());

/* server public static files */
app.use('/', express.static(path.join(__dirname, '/public')));

/* basic routes */
app.use('/', require('./app/routes/root'));
app.use('/register', require('./app/routes/register'));
app.use('/auth', require('./app/routes/auth'));
app.use('/refresh', require('./app/routes/refresh'));
app.use('/logout', require('./app/routes/logout'));

app.use(verifyJWT); //JWT WEB TOKEN

app.use('/employees', require('./app/routes/api/employees'));
app.use('/users', require('./app/routes/api/users'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'app', 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Successfully connected to database -> MongoDB');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});