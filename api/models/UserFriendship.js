const mongoose = require("mongoose");
const { Schema } = mongoose;

const userFriendShipSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	outgoingrequests: {
		type: [String],
		required: false,
	},
	incomingrequests: {
		type: [String],
		required: false,
	},
	friends: {
		type: [String],
		required: false,
	},
});

const UserFriendship = mongoose.model("UserFriendShip", userFriendShipSchema);

module.exports = UserFriendship;
