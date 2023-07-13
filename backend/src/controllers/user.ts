const bcrypt = require('bcrypt');
const { Types } = require('mongoose');
const jwt = require('jsonwebtoken');

const logger = require('../utils/logger');
const config = require('../utils/config');

const { User } = require('../models/User');

const createUser = async (req: any, res: any) => {
	try {
		if (!req.body) {
			return res.status(401).json({ message: 'invalid credentials' });
		}

		const { email, password, username } = req.body;
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

const addUserMood = async (req: any, res: any) => {
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

const addUserJournal = async (req: any, res: any) => {
	try {
		const { email, journal } = req.body;

		if (email === 'undefined' || email === null) {
			return res.status(400).json({ message: 'No email was provided' });
		} else if (journal === undefined || journal === null) {
			return res.status(400).json({ message: 'No data was provided' });
		}

		logger.info(journal, 'Journal');

		await User.findOneAndUpdate(
			{ email: email },
			{
				$push: {
					journal: journal,
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

module.exports = {
	createUser,
	loginUser,
	protectedRoute,
	addUserMood,
	addUserJournal,
	getAllJournals,
};
