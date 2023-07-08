// modules
const express = require('express');
const app = express();
const cors = require('cors')
const mongoose = require('mongoose');

// all routes

// utils
const {info, error} = require('./src/utils/logger');
const {MONGODB_URI} = require('./src/utils/config')
const middleware = require('./src/utils/middleware');

mongoose.set('strictQuery', false);
info('connecting to', MONGODB_URI);

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		info('connected');
	})
	.catch((err) => {
		error('error occurred while connecting: ', err);
	});

// middleware
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

// endpoints

// ending middlewares
app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

module.exports = app;