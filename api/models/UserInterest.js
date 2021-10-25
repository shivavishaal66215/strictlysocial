const mongoose = require("mongoose");
const { Schema } = mongoose;

const userInterestSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	interests: {
		type: [String],
	},
});

const UserInterest = mongoose.model("UserInterest", userInterestSchema);

module.exports = UserInterest;
