const jwt = require('jsonwebtoken');
const config = require('../utils/config');

const UserRouter = require('express').Router();
const {
	createUser,
	loginUser,
	protectedRoute,
	updateMood,
	updateJournal,
	getAllJournals,
	updateStreak,
	getUsersRank,
	addPoints,
	getUserProfile,
	deleteUser,
	updateOneJournal,
	deleteOneJournal,
} = require('../controllers/user');

// POST endpoints
UserRouter.route('/register').post(createUser);
UserRouter.route('/login').post(loginUser);
UserRouter.route('/deleteUser').post(protectedRoute, deleteUser);

// PUT endpoints
UserRouter.route('/updateMood').put(protectedRoute, updateMood);
UserRouter.route('/updateStreak').put(protectedRoute, updateStreak);
UserRouter.route('/addPoints').put(protectedRoute, addPoints);
UserRouter.route('/updateOneJournal').put(protectedRoute, updateOneJournal);
UserRouter.route('/deleteOneJournal').put(protectedRoute, deleteOneJournal);
UserRouter.route('/updateJournal').put(protectedRoute, updateJournal);

// Get endpoints
UserRouter.route('/journal').get(protectedRoute, getAllJournals);
UserRouter.route('/userProfile').get(protectedRoute, getUserProfile);
UserRouter.route('/rank').get(getUsersRank);

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
