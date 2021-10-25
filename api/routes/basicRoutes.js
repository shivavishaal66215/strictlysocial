const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const Login = require("../models/Login");
const UserFriendship = require("../models/UserFriendship");
const UserInterest = require("../models/UserInterest");
const UserSocial = require("../models/UserSocial");
require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/social", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
	console.log("connected to db");
});

router.use(
	session({
		secret: process.env.SESSION_KEY,
		saveUninitialized: false,
		resave: true,
		store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/social" }),
		cookie: {
			secure: false,
			maxAge: 3 * 24 * 60 * 60 * 1000,
		},
	})
);

const authenticate = (req, res, next) => {
	if (req.session.username == null) {
		res.status(403).send("Not logged in");
	} else {
		return next();
	}
};

//Collections:
//1. logins -> username,password
//2. userinterests -> username, [interests]
//3. userfriendships -> username, [outgoingrequests],[incomingrequests],[friends]
//4. usersocial -> username,email,phone
//[5]. sessions -> taken care of by express-session

//use this route for making a new user
//this route creates all the necessary entries in all the collections
router.post("/register", async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await Login.findOne({ username: username });
		if (user != null) {
			res.status(403).send({
				msg: "account exists",
			});
		} else {
			const salt = bcrypt.genSaltSync(12);
			const hashPassword = bcrypt.hashSync(password, salt);
			await Login.insertMany([
				{
					username: username,
					password: hashPassword,
				},
			]);

			await UserSocial.insertMany([
				{
					username: username,
					email: "NA",
					phone: "NA",
				},
			]);

			await UserInterest.insertMany([
				{
					username: username,
					interests: [],
				},
			]);

			await UserFriendship.insertMany([
				{
					username: username,
					outgoingrequests: [],
					incomingrequests: [],
					friends: [],
				},
			]);

			res.status(200).send({
				msg: "user successfully created",
			});
		}
	} catch (e) {
		res.status(500).send("something went wrong");
	}
});

//use this route to login
//username and password are passed in the req body
router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await Login.findOne({ username: username });
		if (user == null) {
			res.status(403).send({
				msg: "username or password incorrect",
			});
		} else {
			const isValid = bcrypt.compareSync(password, user.password);
			if (!isValid) {
				res.status(403).send({
					msg: "username or password incorrect",
				});
			} else {
				req.session.username = username;
				res.status(200).send({
					msg: "user successfully logged in",
				});
			}
		}
	} catch (e) {
		res.status(500).send("something went wrong");
	}
});

//use this route to logout
//nothing has to be passed in
router.post("/logout", (req, res) => {
	try {
		req.session.destroy((msg) => {
			console.log(`${req.sessionID} Destroyed`);
		});
		res.status(200).send("logged out successfully");
	} catch (e) {
		res.status(500).send(e);
	}
});

//use this route to change password
//new password is passed in the req body
router.post("/password", authenticate, async (req, res) => {
	const username = req.session.username;
	const { password, newPassword } = req.body;

	/*
	Todo:
	1. Check if the old password is correct
	2. If yes,
		1. Change password to new password
	3.Else,
		1. Send back an error message
	*/

	try {
		//checking if the old password is correct
		const user = await Login.findOne({ username: username });
		const salt = bcrypt.genSaltSync(12);
		const hashNewPassword = bcrypt.hashSync(newPassword, salt);

		const isValid = bcrypt.compareSync(password, user.password);
		if (!isValid) {
			//old password does not match database
			//solution: send back an error

			throw "old password does not match";
		}

		//old password matches so update the password in database
		await Login.updateOne(
			{ username: username },
			{ $set: { password: hashNewPassword } }
		);
	} catch (e) {
		res.status(500).send(e);
	}
});

module.exports = router;
