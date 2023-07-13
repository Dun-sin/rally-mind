const jwt = require('jsonwebtoken');
const config = require('../utils/config');

const UserRouter = require('express').Router();
const {
	createUser,
	loginUser,
	protectedRoute,
	addUserMood,
	addUserJournal,
	getAllJournals,
} = require('../controllers/user');

UserRouter.route('/register').post(createUser);
UserRouter.route('/login').post(loginUser);
UserRouter.route('/updateMood').put(protectedRoute, addUserMood);
UserRouter.route('/updateJournal').put(protectedRoute, addUserJournal);
UserRouter.route('/journal').get(protectedRoute, getAllJournals);
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
