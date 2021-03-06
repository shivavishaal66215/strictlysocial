const express = require("express");
const router = express.Router();
const UserInterest = require("../models/UserInterest");
const UserSocial = require("../models/UserSocial");
const UserFriendship = require("../models/UserFriendship");
const axios = require("axios");
const qs = require("qs");
require("dotenv").config();

const makeCSV = (arr) => {
	result = "";
	if (arr.length == 0) {
		return result;
	}

	for (let i = 0; i < arr.length - 1; i++) {
		result += arr[i];
		result += ",";
	}

	result += arr[arr.length - 1];
	return result;
};

//returns true if target is found inside arr
const isPresent = function (arr, target) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === target) {
			return true;
		}
	}

	return false;
};

//returns true if the inputarr contains all the elements found in targetarr
const matchAll = function (inputarr, targetarr) {
	for (let i = 0; i < targetarr.length; i++) {
		if (!isPresent(inputarr, targetarr[i])) {
			return false;
		}
	}

	return true;
};

//selects only the users who have all the target_interests from the input "users" list
//the return value is of the type "array of selected users"
const retValidUsers = function (users, target_interest) {
	let result = [];

	for (let i = 0; i < users.length; i++) {
		if (matchAll(users[i].interests, target_interest)) {
			result.push(users[i].username);
		}
	}

	return result;
};

//remove items from arr that are present in arr2
const setSubtraction = (arr, arr2) => {
	let result = arr.filter((ele) => {
		return !isPresent(arr2, ele);
	});

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

//returns the list of all users who have all the passed in interests
//doesnt include existing friends
//doesnt include existing outgoing requests
//doesnt including existing incoming requests
//replace this search with api call to recommender once dataset is configured. [wont be done for now]
router.post("/search", async (req, res) => {
	const username = req.session.username;
	try {
		const user = await UserFriendship.findOne({ username: username });
		let friends = user.friends;
		let outgoingrequests = user.outgoingrequests;
		let incomingrequests = user.incomingrequests;

		let blacklist = makeCSV([
			...friends,
			...outgoingrequests,
			...incomingrequests,
		]);

		blacklist += ",vishaal";
		const result = await axios({
			method: "get",
			url: "http://127.0.0.1:5000/recommend", //insert URL for flask API here
			data: qs.stringify({
				userid: username,
				blacklist: blacklist,
			}),
			headers: {
				"content-type": "application/x-www-form-urlencoded;charset=utf-8",
			},
			withCredentials: true,
		});
		res.status(200).send(result.data);
	} catch (e) {
		console.log(e);
		res.status(500).send([]);
	}
});

//fetches the email address of the user whose username is passed in with the body
router.post("/getUserEmail", async (req, res) => {
	const { username } = req.body;
	try {
		const user = await UserSocial.findOne({ username: username });

		if (user === null) {
			//user is not present in the UserSocial Collection
			throw "no such user";
		} else {
			res.status(200).send(user.email);
		}
	} catch (e) {
		res.status(500).send(e);
	}
});

//fetches the phone number of user whose username is passed in with the body
router.post("/getUserPhone", async (req, res) => {
	const { username } = req.body;
	try {
		const user = await UserSocial.findOne({ username: username });
		if (user === null) {
			//user is not present in the UserSocial Collection
			throw "no such user";
		} else {
			res.status(200).send(user.phone);
		}
	} catch (e) {
		res.status(500).send(e);
	}
});

//fetches the entire profile of a user whose username is passed into the body
//but before that, check if friend is in friends of username
router.post("/getUserProfile", async (req, res) => {
	const { friend } = req.body;
	const username = req.session.username;

	try {
		//checking if friend is in friends of username
		const user_friend_check = await UserFriendship.findOne({
			username: username,
		});

		if (!isPresent(user_friend_check.friends, friend)) {
			//friend is not a friend of username
			throw "not friends";
		}

		const friend_user = await UserSocial.findOne({ username: friend });

		if (friend_user == null) {
			throw "no such user";
		} else {
			const result = {
				username: friend_user.username,
				phone: friend_user.phone,
				email: friend_user.email,
			};

			res.status(200).send(result);
		}
	} catch (e) {
		res.status(500).send({});
	}
});

module.exports = router;
