import { model, Model, Schema, models, ObjectId, Document } from 'mongoose';

export interface IUser extends Document {
	_id: ObjectId;
	username: string;
	email: string;
	avatarUrl: string;
	gender: 'female' | 'male' | 'other';
	moods: {
		date: Date;
		mood: string;
		reason: string;
	}[];
	password: string;
	lastLogin: Date;
	gamification: {
		points: number;
		streak: number;
		level: number;
		highScore: number;
	};
	songs: {
		energized: string[] | null;
		happy: string[] | null;
		sad: string[] | null;
		calm: string[] | null;
		focused: string[] | null;
	};
	journal: {
		date: Date;
		message: string;
	}[];
}

interface IUserDocument extends IUser {}

interface IUserModel extends Model<IUserDocument> {}

const UserSchema: Schema = new Schema<IUserDocument, IUserModel>({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	avatarUrl: { type: String },
	gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
	moods: [
		{
			date: { type: Date, required: true },
			mood: { type: String, required: true },
			reason: { type: String, required: true },
		},
	],
	lastLogin: { type: Date },
	password: { type: String, required: true },
	gamification: {
		points: { type: Number, required: true, default: 0 },
		streak: { type: Number, required: true, default: 0 },
		level: { type: Number, required: true, default: 1 },
		highScore: { type: Number, default: 0 },
	},
	songs: {
		energized: [{ type: String }],
		happy: [{ type: String }],
		sad: [{ type: String }],
		calm: [{ type: String }],
		focused: [{ type: String }],
	},
	journal: [
		{
			date: { type: Date, required: true },
			message: { type: String, required: true },
		},
	],
});

UserSchema.set('toJSON', {
	transform: (document, objectToBeReturned) => {
		objectToBeReturned.id = objectToBeReturned._id.toString();
		delete objectToBeReturned._id;
		delete objectToBeReturned.__v;
		delete objectToBeReturned.password;
	},
});

export const User =
	models.User || model<IUserDocument, IUserModel>('User', UserSchema);
