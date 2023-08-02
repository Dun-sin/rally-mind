const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const logger = require('../utils/logger');
const config = require('../utils/config');

const { User } = require('../models/User');

const createUser = async (req: any, res: any) => {
	try {
		if (!req.body) {
			return res.status(401).json({ message: 'invalid credentials' });
		}

		const { email, password, username, gender } = req.body;
		const existingUser = await User.findOne({ email });
		const exisitingUsername = await User.findOne({ username });

		if (existingUser) {
			return res.status(409).json({ message: 'User already exists' });
		} else if (exisitingUsername) {
			return res.status(409).json({ message: 'Username already in use' });
		}

		if (password.length < 8) {
			return res
				.status(400)
				.json({ message: 'Password should be 8 or more characters' });
		}

		const saltrounds = 10;
		const passwordHash = await bcrypt.hash(password, saltrounds);

		const userDetails = {
			email,
			password: passwordHash,
			username,
			gender,
		};

		const user = new User(userDetails);
		await user.save();

		const token = jwt.sign({ email }, config.SECRET, { expiresIn: '31d' });

		res.status(200).json({ token });
	} catch (error) {
		logger.error(error);
		return res.status(500).json({ message: 'Failed to register user' });
	}
};

const loginUser = async (req: any, res: any) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		const passwordCorrect =
			user === null ? false : await bcrypt.compare(password, user.password);

		if (!user || !passwordCorrect) {
			return res.status(400).json({
				message: 'Please check your email and password',
			});
		}

		// Generate JWT token
		const token = jwt.sign({ email }, config.SECRET, { expiresIn: '31d' });
		return res.status(200).json({ token });
	} catch (error) {
		logger.error(error);
		return res.status(500).json({ message: 'Failed to login user' });
	}
};

const deleteUser = async (req: any, res: any) => {
	try {
		const { email } = req.body;

		console.log(email);

		if (email === undefined || email === null) {
			return res.status(400).json({ message: 'No email was provided' });
		}

		await User.findOneAndDelete({ email: email });

		return res.status(200).json({ message: `Account Deleted` });
	} catch (error) {
		logger.error(error);
		return res
			.status(500)
			.json({ message: `Internal Server Error: Couldn't delete account` });
	}
};

const protectedRoute = (req: any, res: any, next: any) => {
	const authHeader = req.headers.authorization;

	if (authHeader) {
		const token = authHeader.split(' ')[1];

		jwt.verify(token, config.SECRET, (err: any, decoded: any) => {
			if (err) {
				res.status(401).json({ message: 'Invalid token' });
			} else {
				req.user = decoded.email; // Assign the decoded email to the request object
				next();
			}
		});
	} else {
		res.status(401).json({ message: 'Missing authorization header' });
	}
};

const updateMood = async (req: any, res: any) => {
	try {
		const { email, moodDetails } = req.body;

		if (email === undefined || email === null) {
			return res.status(400).json({ message: 'No email was provided' });
		} else if (moodDetails === undefined || moodDetails === null) {
			return res.status(400).json({ message: `No data was provided` });
		}

		logger.info(moodDetails);

		await User.findOneAndUpdate(
			{ email: email },
			{
				$push: {
					moods: moodDetails,
				},
				$inc: {
					'gamification.points': 10,
				},
			},
			{
				returnOriginal: false,
			},
		);

		return res.status(200).json({ message: `Mood added` });
	} catch (error) {
		logger.error(error);
		return res.status(500).json({ message: `Internal Server Error` });
	}
};

const updateJournal = async (req: any, res: any) => {
	try {
		const { email, journal } = req.body;

		if (email === 'undefined' || email === null) {
			return res.status(400).json({ message: 'No email was provided' });
		} else if (journal === undefined || journal === null) {
			return res.status(400).json({ message: 'No data was provided' });
		}

		await User.findOneAndUpdate(
			{ email: email },
			{
				$push: {
					journal: journal,
				},
				$inc: {
					'gamification.points': 25,
				},
			},
			{
				returnOriginal: false,
			},
		);

		return res.status(200).json({ message: 'Journal added' });
	} catch (error) {
		logger.error(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

const updateOneJournal = async (req: any, res: any) => {
	try {
		const { email, journal } = req.body;

		logger.info(journal);
		if (email === 'undefined' || email === null) {
			return res.status(400).json({ message: 'No id was provided' });
		} else if (journal === undefined || journal === null) {
			return res.status(400).json({ message: 'No data was provided' });
		}

		const updateData = {
			'journal.$[element].date': new Date(),
			'journal.$[element].message': journal.message,
		};

		const options = {
			arrayFilters: [
				{ 'element._id': new mongoose.Types.ObjectId(journal.id) },
			],
			new: true,
		};

		await User.findOneAndUpdate({ email: email }, updateData, options);

		return res.status(200).json({ message: 'Journal Updated' });
	} catch (error) {
		logger.error(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

const deleteOneJournal = async (req: any, res: any) => {
	try {
		const { email, id } = req.body;

		logger.info(id);
		if (email === 'undefined' || email === null) {
			return res.status(400).json({ message: 'No id was provided' });
		} else if (id === undefined || id === null) {
			return res.status(400).json({ message: 'No data was provided' });
		}

		const updateData = {
			$pull: { journal: { _id: new mongoose.Types.ObjectId(id) } },
		};

		const options = {
			new: true,
		};

		await User.findOneAndUpdate({ email: email }, updateData, options);

		return res.status(200).json({ message: 'Journal Deleted' });
	} catch (error) {
		logger.error(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

const getAllJournals = async (req: any, res: any) => {
	try {
		const email = req.query.email;

		if (email === undefined || email === null) return;

		const user = await User.findOne({ email });

		logger.info(user.journal);
		return res.status(200).json({ message: user.journal });
	} catch (error) {
		logger.error(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

const updateStreak = async (req: any, res: any) => {
	try {
		const { email, isStreakOn } = req.body;

		if (email === 'undefined' || email === null) {
			return res.status(400).json({ message: 'No email was provided' });
		} else if (isStreakOn === undefined || isStreakOn === null) {
			return res.status(400).json({ message: 'No data was provided' });
		}

		logger.info(isStreakOn);

		if (isStreakOn) {
			await User.findOneAndUpdate(
				{ email: email },
				{
					$inc: {
						'gamification.streak': 1,
					},
				},
				{
					returnOriginal: false,
				},
			);
		} else {
			await User.findOneAndUpdate(
				{ email: email },
				{
					'gamification.streak': 0,
				},
				{
					returnOriginal: false,
				},
			);
		}

		return res.status(200).json({ message: `Streak Updated` });
	} catch (error) {
		logger.error(error);
		return res.status(500).json({ message: `Internal Server Error` });
	}
};

const getUsersRank = async (req: any, res: any) => {
	try {
		const topUsers: {
			email: string;
			points: number;
		}[] = await User.aggregate([
			{
				$sort: { 'gamification.points': -1 },
			},
			{
				$limit: 3,
			},
			{
				$project: {
					_id: 0,
					name: '$username',
					points: '$gamification.points',
				},
			},
		]);

		const remainUsers: {
			email: string;
			points: number;
		}[] = await User.aggregate([
			{
				$sort: { 'gamification.points': -1 },
			},
			{
				$skip: 3,
			},
			{
				$project: {
					_id: 0,
					name: '$username',
					points: '$gamification.points',
				},
			},
		]);

		return res.status(200).json({
			message: {
				top3: topUsers,
				others: remainUsers,
			},
		});
	} catch (error) {
		logger.error(error);
		return res.status(500).json({ message: `Internal Server Error` });
	}
};

const addPoints = async (req: any, res: any) => {
	try {
		const { email, points } = req.body;

		if (email === 'undefined' || email === null) {
			return res.status(400).json({ message: 'No email was provided' });
		} else if (points === undefined || points === null) {
			return res.status(400).json({ message: 'No data was provided' });
		}

		await User.findOneAndUpdate(
			{ email: email },
			{
				$inc: {
					'gamification.points': points,
				},
			},
			{
				returnOriginal: false,
			},
		);

		return res.status(200).json({ message: 'Added Points' });
	} catch (error) {
		logger.error(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

const getUserProfile = async (req: any, res: any) => {
	try {
		const email = req.query.email;

		if (email == undefined || email === null) {
			return res.status(400).json({ message: 'No email was provided' });
		}

		const user = await User.findOne({ email });
		const details = {
			username: user.username,
			email: user.email,
			gender: user.gender,
			gamification: {
				points: user.gamification.points,
				streak: user.gamification.streak,
			},
		};

		logger.info(details);
		return res.status(200).json({ message: details });
	} catch (error) {
		logger.error(error);
		return res.staus(500).json({ message: 'Internal Server Error' });
	}
};

module.exports = {
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
};
