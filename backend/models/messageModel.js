const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema(
	{
		from: String,
		to: String,
		content: String,
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Message", messageSchema);
