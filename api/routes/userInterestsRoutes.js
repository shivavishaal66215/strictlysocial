const express = require("express");
const router = express.Router();
const UserInterest = require("../models/UserInterest");
const Interest = require("../models/Interest");
require("dotenv").config();

const convertToArr = (s) => {
	if (s === "") {
		return [];
	}

	let result = [];
	let curstring = "";
	for (let i = 0; i < s.length; i++) {
		if (s[i] == ",") {
			result.push(curstring);
			curstring = "";
		} else {
			curstring += s[i];
		}
	}
	if (curstring !== "") {
		result.push(curstring);
	}
	return result;
};

const authenticate = (req, res, next) => {
	if (req.session.username == null) {
		res.status(403).send("Not logged in");
	} else {
		return next();
	}
};

router.use(authenticate);

//fetch the interests array
router.get("/interest", async (req, res) => {
	const username = req.session.username;
	try {
		let user = await UserInterest.findOne({ username: username });
		res.status(200).send(user.interests);
	} catch (e) {
		res.status(500).send([]);
	}
});

//set the interest array equal to the passed in array
router.post("/setInterest", async (req, res) => {
	const { interest } = req.body;
	const username = req.session.username;

	const interest_arr = convertToArr(interest);

	try {
		await UserInterest.updateOne(
			{ username: username },
			{ $set: { interests: interest_arr } }
		);

		res.status(200).send("interests successfully set");
	} catch (e) {
		res.status(500).send("something went wrong");
	}
});

//get list of all available interests
router.get("/allInterests", async (req, res) => {
	try {
		const interest = await Interest.find();
		res.send(interest[0].interests);
	} catch (e) {
		res.status(500).send([]);
	}
});

module.exports = router;
