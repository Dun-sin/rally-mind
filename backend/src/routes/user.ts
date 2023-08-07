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
	updatePoints,
	getUserProfile,
	deleteUser,
	updateOneJournal,
	deleteOneJournal,
	updateLastLogin,
	updateHighScore,
	getHighScore,
	getLastLogin,
	updateJournalTime,
	getJournalTime,
} = require('../controllers/user');
const { User } = require('../models/User');

// POST endpoints
UserRouter.route('/register').post(createUser);
UserRouter.route('/login').post(loginUser);
UserRouter.route('/deleteUser').post(protectedRoute, deleteUser);

// PUT endpoints
UserRouter.route('/updateMood').put(protectedRoute, updateMood);
UserRouter.route('/updateStreak').put(protectedRoute, updateStreak);
UserRouter.route('/updatePoints').put(protectedRoute, updatePoints);
UserRouter.route('/updateOneJournal').put(protectedRoute, updateOneJournal);
UserRouter.route('/deleteOneJournal').put(protectedRoute, deleteOneJournal);
UserRouter.route('/updateJournal').put(protectedRoute, updateJournal);
UserRouter.route('/updateLastLogin')
	.put(protectedRoute, updateLastLogin)
	.get(protectedRoute, getLastLogin);
UserRouter.route('/updateHighScore')
	.put(protectedRoute, updateHighScore)
	.get(protectedRoute, getHighScore);
UserRouter.route('/journalTime')
	.put(protectedRoute, updateJournalTime)
	.get(protectedRoute, getJournalTime);

// Get endpoints
UserRouter.route('/journal').get(protectedRoute, getAllJournals);
UserRouter.route('/userProfile').get(protectedRoute, getUserProfile);
UserRouter.route('/rank').get(getUsersRank);

UserRouter.route('/protected').get(async (req: any, res: any) => {
	const authHeader = req.headers.authorization;

	if (authHeader) {
		const token = authHeader.split(' ')[1];

		try {
			jwt.verify(token, config.SECRET, async (err: any, decoded: any) => {
				if (err) {
					res.status(401).json({ message: 'invalid token' });
				} else {
					const user = await User.findOne({ email: decoded.email });
					if (!user) {
						return res.status(400).json({
							message: 'User doesn`t exist',
						});
					}
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
