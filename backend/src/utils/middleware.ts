const logger3 = require('./logger');
const User = require('../models/User');
const config3 = require('../utils/config');

const jwt = require('jsonwebtoken');

const requestLogger = (request: any, response: any, next: any) => {
	logger3.info('Method:', request.method);
	logger3.info('Path:  ', request.path);
	logger3.info('Body:  ', request.body);
	logger3.info('---');
	next();
};

const unknownEndPoint = (request: any, response: any) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error: any, request: any, response: any, next: any) => {
	logger3.error(error.message);

	next(error);
};

const protectedEndPoint = (request: any, response: any) => {
	// Get the authorization header from the request
	const authHeader = request.headers.authorization;

	if (authHeader) {
		const token = authHeader.split(' ')[1];

		// Verify the JWT token
		jwt.verify(token, config3.SECRET, (err: any, decoded: any) => {
			if (err) {
				request.status(401).json({ message: 'Invalid token' });
			} else {
				// Token is valid, allow access to protected route
				request.status(200).json({ message: 'Access granted' });
			}
		});
	} else {
		response.status(401).json({ message: 'Missing authorization header' });
	}
};

module.exports = {
	requestLogger,
	unknownEndPoint,
	errorHandler,
	protectedEndPoint,
};
