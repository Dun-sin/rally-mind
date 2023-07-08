const loggers = require('./logger');
const { SECRET } = require('./config');
const User = require('../models/userSchema');

const jwt = require('jsonwebtoken');

const requestLogger = (request, response, next) => {
	loggers.info('Method:', request.method);
	loggers.info('Path:  ', request.path);
	loggers.info('Body:  ', request.body);
	loggers.info('---');
	next();
};

const unknownEndPoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
	loggers.error(error.message);


	next(error);
};


module.exports = {
	requestLogger,
	unknownEndPoint,
	errorHandler,
	
};
