const UserRouter = require('express').Router();
const UserController = require('../controllers/user');

UserRouter.route('/register').post(UserController.createUser);
UserRouter.route('/login').post(UserController.loginUser);
UserRouter.route('/protected').get(UserController.protectedRoute);

module.exports = UserRouter;
