const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			min: [8, "username must be at least than 8 character"],
			required: "username is required!",
		},
		email: {
			type: String,
			trim: true,
			unique: true,
			min: [8, "email must be at least than 8 character"],
			required: "Email is required!",
		},
		friends: [
			{
				friendId: String,
				username: String,
				imageProfile: { type: String, default: "user.png" },
				state: {
					type: Number,
					enum: [0, 1], // 0 = friend request  ___   1 = confirmed friend request
					default: 0,
				},
			},
		],
		password: {
			type: String,
			required: "Password is required",
		},
		imageProfile: {
			type: String,
			default: "user.png",
		},
		isOnline: {
			type: Boolean,
			default: false, // false  = offline , true = online
		},
	},
	{
		timestamps: true,
	}
);
module.exports = mongoose.model("User", userSchema);
