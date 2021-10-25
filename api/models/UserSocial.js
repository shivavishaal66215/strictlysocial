const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSocialSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: false,
	},
	phone: {
		type: String,
		required: false,
	},
});

const UserSocial = mongoose.model("UserSocial", userSocialSchema);

module.exports = UserSocial;
