const jwt = require('jsonwebtoken');
const config = require('../utils/config');

const UserRouter = require('express').Router();
const UserController = require('../controllers/user');

UserRouter.route('/register').post(UserController.createUser);
UserRouter.route('/login').post(UserController.loginUser);
UserRouter.route('/updateMood').put(
	UserController.protectedRoute,
	UserController.addUserMood,
);
UserRouter.route('/protected').get(async (req: any, res: any) => {
	const authHeader = req.headers.authorization;

	if (authHeader) {
		const token = authHeader.split(' ')[1];

		try {
			jwt.verify(token, config.SECRET, (err: any, decoded: any) => {
				if (err) {
					res.status(401).json({ message: 'invalid token' });
				} else {
					res.status(200).json({ message: decoded.email });
				}
			});
		} catch (err) {
			return res.status(401).json({ message: 'Invalid token' });
		}
	} else {
		return res.status(401).json({ message: 'Missing authorization header' });
	}
});

module.exports = UserRouter;
