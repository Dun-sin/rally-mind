// modules
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

// all routes
const UserRoute = require('./routes/user');

// utils
const logger = require('./utils/logger');
const config = require('./utils/config');
const middleware = require('./utils/middleware');

mongoose.set('strictQuery', false);
logger.info('connecting to', config.MONGODB_URI);

mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('connected');
	})
	.catch((err: String) => {
		logger.error('error occurred while connecting: ', err);
	});

// middleware
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

// endpoints
app.use('/api/user', UserRoute);

// ending middlewares
app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

module.exports = app;
