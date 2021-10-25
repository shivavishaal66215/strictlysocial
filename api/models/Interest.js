const mongoose = require("mongoose");
const { Schema } = mongoose;

const InterestSchema = new Schema({
	interests: {
		type: [String],
		required: false,
	},
});

const Interest = mongoose.model("Interest", InterestSchema);

module.exports = Interest;
