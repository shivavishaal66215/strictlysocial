const mongoose = require("mongoose");
const Interest = require("./models/Interest");
const interest_arr = require("./interests");
mongoose.connect("mongodb://localhost:27017/social", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
	console.log("connected to db");
});

Interest.insertMany([
	{
		interests: interest_arr,
	},
]);
