const express = require("express");
const router = express.Router();
const UserFriendship = require("../models/UserFriendship");
require("dotenv").config();

const authenticate = (req, res, next) => {
	if (req.session.username == null) {
		res.status(403).send("Not logged in");
	} else {
		return next();
	}
};
router.use(authenticate);
/*
TODO:
	Add a route to perform verfications on the userfriendships collection to check for errors
*/

//fetching the outgoing list
router.get("/requestFriend", async (req, res) => {
	const username = req.session.username;
	try {
		let user = await UserFriendship.findOne({ username: username });

		res.status(200).send(user.outgoingrequests);
	} catch (e) {
		res.status(500).send([]);
	}
});

//fetching incoming requests list
router.get("/incomingFriend", async (req, res) => {
	const username = req.session.username;

	try {
		let user = await UserFriendship.findOne({ username: username });

		res.status(200).send(user.incomingrequests);
	} catch (e) {
		res.status(500).send([]);
	}
});

//make a new friend request
router.post("/requestFriend", async (req, res) => {
	const username = req.session.username;
	const { friend } = req.body;

	/*
	TODO:
	1. Make sure that username and friend are different
	2. If not:
		1. Send back an error message
	3. Make sure that friend is a member in the system
	4. If not:
		1. Send back an error message
	5. Check if friend is present in the incoming of username:
		That is, friend has sent a request to username
	6. If yes,
		1. Send back an error message
	7. Check if friend and username are already friends
		If yes,
			Send back an error message
	8. Check if username is already in the incoming of friend
	9. If yes, 
		1. Send back an error message
	10. Check if friend is already in the outgoing of friend
	11. If yes,
		1. Send back an error message

	Note:
		It is not necessary to check both 7 and 9 but theres nothing like too safe
	*/

	try {
		//checking if the username and the friend are different people
		if (username === friend) {
			throw "cannot add yourself";
		}

		//fetching the friend
		const friend_user = await UserFriendship.findOne({ username: friend });
		const user = await UserFriendship.findOne({ username: username });

		//checking if friend exists in the system
		if (friend_user == null) {
			throw "target user does not exist";
		}

		//checking if friend is already in the incoming of username
		let user_incoming = user.incomingrequests;
		user_incoming = user_incoming.filter((ele) => {
			return ele === friend;
		});

		if (user_incoming.length != 0) {
			//friend is already in the incoming of user
			//that is: friend has already made a request to username

			throw "friend has already made a request. try accepting.";
		}

		//checking if friend and username are already friends
		//just check the username's friends list
		let user_friends = user.friends;
		user_friends = user_friends.filter((ele) => {
			return ele === friend;
		});

		if (user_friends.length != 0) {
			//friend and username are already friends
			//Solution: return back an error message

			throw "friend is already a friend[touche.]";
		}

		//checking if username is already in the incoming of friend
		let friend_user_incoming = friend_user.incomingrequests;
		let result = friend_user_incoming.filter((ele) => {
			return ele === username;
		});

		if (result.length === 0) {
			//username is not in the incoming of friend
			//Solution: add username to the incoming of friend

			friend_user_incoming = friend_user.incomingrequests;
			friend_user_incoming.push(username);
			await UserFriendship.updateOne(
				{ username: friend },
				{ $set: { incomingrequests: friend_user_incoming } }
			);
		} else {
			//username is already in the incoming of friend
			//Solution: send back an error message

			throw "request already exists";
		}

		//checking if friend is already in the outgoing of username
		let user_outgoing = user.outgoingrequests;
		result = user_outgoing.filter((ele) => {
			return ele === friend;
		});

		if (result.length == 0) {
			//friend is not in the outgoing of username
			//Solution: add friend to the outgoing of username

			user_outgoing = user.outgoingrequests;
			user_outgoing.push(friend);
			await UserFriendship.updateOne(
				{ username: username },
				{ $set: { outgoingrequests: user_outgoing } }
			);
		} else {
			//friend is already in the outgoing of username
			//Solution: Send back an error message

			throw "request already exists";
		}

		res.status(200).send("request successfully made");
	} catch (e) {
		res.status(500).send(e);
	}
});

//accept a new friend request
router.post("/incomingFriend", async (req, res) => {
	const username = req.session.username;
	const { friend } = req.body;

	/*
	TODO:
	1. Check if friend is present in the system
	2. Check if friend is present in incoming of username
	3. Check if username is present in the outgoing of friend
	4. If atleast one of them is false, send back error message
	5. otherwise:
		1. remove username from the outgoing of friend
		2. remove friend from the incoming of username
		3. add friend to the friends of username
		4. add username to the friends of friend
	*/

	try {
		const user = await UserFriendship.findOne({ username: username });
		const friend_user = await UserFriendship.findOne({ username: friend });

		//checking if friend is in the system
		if (friend_user == null) {
			throw "friend does not exist in the system";
		}
		//checking if friend is present in the incoming of username
		let user_incoming = user.incomingrequests;
		user_incoming = user_incoming.filter((ele) => {
			return ele === friend;
		});
		if (user_incoming.length == 0) {
			//friend is not present in the incoming of username
			throw "friend is not present in the incoming list";
		}

		//checking if username is present in the outgoing of friend
		let friend_user_outgoing = friend_user.outgoingrequests;
		friend_user_outgoing = friend_user_outgoing.filter((ele) => {
			return ele === username;
		});
		if (friend_user_outgoing.length == 0) {
			//username is not present in the outgoing of friend
			throw "username is not present in the outgoing list";
		}

		//all prelimnary checks are completed above

		//removing username from the outgoing of friend and adding username to the friends of friend
		friend_user_outgoing = friend_user.outgoingrequests;
		friend_user_outgoing = friend_user_outgoing.filter((ele) => {
			return ele !== username;
		});
		let friend_user_friends = friend_user.friends;
		friend_user_friends.push(username);
		await UserFriendship.updateOne(
			{
				username: friend,
			},
			{
				$set: {
					outgoingrequests: friend_user_outgoing,
					friends: friend_user_friends,
				},
			}
		);

		//removing friend from the incoming of username and adding friend to the friends of username
		user_incoming = user.incomingrequests;
		user_incoming = user_incoming.filter((ele) => {
			return ele !== friend;
		});
		let user_friends = user.friends;
		user_friends.push(friend);
		await UserFriendship.updateOne(
			{
				username: username,
			},
			{ $set: { incomingrequests: user_incoming, friends: user_friends } }
		);

		res.status(200).send("request successfully accepted");
	} catch (e) {
		res.status(500).send(e);
	}
});

//cancel outgoing request
//this route does nothing if they are already friends
router.post("/canceloutgoing", async (req, res) => {
	const username = req.session.username;
	const { friend } = req.body;

	/*
	Todo:
	1. Check if friend is in the system
	2. If not, 
		1. Send back an error
	3. Remove friend from the outgoing of username
	4. Remove username from the incoming of friend
	*/

	try {
		const user = await UserFriendship.findOne({ username: username });
		const friend_user = await UserFriendship.findOne({ username: friend });

		//check if friend is in the system
		if (friend_user == null) {
			throw "friend is not in the system";
		}

		//Removing friend from the outgoing of username
		let user_outgoing = user.outgoingrequests;
		user_outgoing = user_outgoing.filter((ele) => {
			return ele !== friend;
		});

		await UserFriendship.updateOne(
			{ username: username },
			{ $set: { outgoingrequests: user_outgoing } }
		);

		//Removing username from the incoming of friend
		let friend_incoming = friend_user.incomingrequests;
		friend_incoming = friend_incoming.filter((ele) => {
			return ele !== username;
		});

		await UserFriendship.updateOne(
			{ username: friend },
			{ $set: { incomingrequests: friend_incoming } }
		);
		res.status(200).send("request successfully cancelled");
	} catch (e) {
		res.status(500).send(e);
	}
});

//remove friend
router.post("/removeFriend", async (req, res) => {
	const username = req.session.username;
	const { friend } = req.body;

	/*
	TODO:
	1. Check if friend is in the system
	2. If no,
		1. Send back an error message
	3. Remove friend from the friends of username and username from the friends of friend
	*/

	try {
		const user = await UserFriendship.findOne({ username: username });
		const friend_user = await UserFriendship.findOne({ username: friend });

		//checking if friend exists in the system
		if (friend_user == null) {
			throw "friend does not exist in the system";
		}

		//Removing friend from friends of username
		let user_friends = user.friends;
		user_friends = user_friends.filter((ele) => {
			return ele !== friend;
		});

		await UserFriendship.updateOne(
			{ username: username },
			{ $set: { friends: user_friends } }
		);

		//Removing username from the friends of friend
		let friend_friends = friend_user.friends;
		friend_friends = friend_friends.filter((ele) => {
			return ele !== username;
		});

		await UserFriendship.updateOne(
			{ username: friend },
			{ $set: { friends: friend_friends } }
		);
		res.status(200).send("friend successfully removed");
	} catch (e) {
		res.status(500).send(e);
	}
});

router.get("/friends", async (req, res) => {
	const username = req.session.username;

	try {
		let user = await UserFriendship.findOne({ username: username });

		const result = user.friends;
		res.status(200).send(result);
	} catch (e) {
		res.status(500).send([]);
	}
});

module.exports = router;
