const express = require("express");
const router = express.Router();
const UserSocial = require("../models/UserSocial");
require("dotenv").config();

const authenticate = (req, res, next) => {
	if (req.session.username == null) {
		res.status(403).send("Not logged in");
	} else {
		return next();
	}
};

router.use(authenticate);

//to update the phone number
//phone number is passed in the req body
router.post("/phone", async (req, res) => {
	const { phone } = req.body;
	const username = req.session.username;
	try {
		await UserSocial.updateOne(
			{ username: username },
			{ $set: { phone: phone } }
		);

		res.status(200).send("phone added");
	} catch (e) {
		res.status(500).send(e.message);
	}
});

//to update the email
//email is passed in the req body
router.post("/email", async (req, res) => {
	const { email } = req.body;
	const username = req.session.username;
	try {
		await UserSocial.updateOne(
			{ username: username },
			{ $set: { email: email } }
		);

		res.status(200).send("email added");
	} catch (e) {
		res.status(500).send(e.message);
	}
});

//to get the current user's profile as an object
router.get("/myprofile", async (req, res) => {
	const username = req.session.username;
	try {
		let user = await UserSocial.findOne({ username: username });

		const result = {
			username: user.username,
			phone: user.phone,
			email: user.email,
		};
		res.status(200).send(result);
	} catch (e) {
		res.status(500).send(e.message);
	}
});

router.get("/username", (req, res) => {
	res.status(200).send(req.session.username);
});

module.exports = router;
