require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/courses.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);

module.exports = app;

const studentRoutes = require('./routes/student.routes');
app.use('/api/students', studentRoutes);

const errorMiddleware = require('./middleware/error.middleware');
app.use(errorMiddleware);

const errorMiddleware = require('./middleware/error.middleware');
app.use(errorMiddleware);
