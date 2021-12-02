import React, { Component } from "react";
import axios from "axios";
import "./styles/Friends.css";
import avatar from "./images/undraw_male_avatar_323b.svg";
const qs = require("qs");

let isAllowed = true;

const fetchFriends = async () => {
	try {
		const res = await axios({
			method: "get",
			url: "/friends",
			headers: {
				"content-type": "application/x-www-form-urlencoded;charset=utf-8",
			},
			withCredentials: true,
		});
		isAllowed = true;
		return res.data;
	} catch (e) {
		console.log("cannot fetch friends");
		isAllowed = false;
		return [];
	}
};

const fetchOutgoingList = async () => {
	try {
		const res = await axios({
			method: "get",
			url: "/requestFriend",
			headers: {
				"content-type": "application/x-www-form-urlencoded;charset=utf-8",
			},
			withCredentials: true,
		});
		isAllowed = true;
		return res.data;
	} catch (e) {
		console.log("cannot fetch outgoing list");
		isAllowed = false;
		return [];
	}
};

const fetchIncomingList = async () => {
	try {
		const res = await axios({
			method: "get",
			url: "/incomingFriend",
			headers: {
				"content-type": "application/x-www-form-urlencoded;charset=utf-8",
			},
			withCredentials: true,
		});
		isAllowed = true;
		return res.data;
	} catch (e) {
		console.log("cannot fetch outgoing list");
		isAllowed = false;
		return [];
	}
};

export default class Friends extends Component {
	constructor(props) {
		super(props);

		this.state = {
			friends: [],
			outgoing: [],
			incoming: [],
			newRequest: "",
		};

		this.handleNewRequestChange = this.handleNewRequestChange.bind(this);
		this.handleNewRequestSet = this.handleNewRequestSet.bind(this);
		this.handleAccept = this.handleAccept.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	handleNewRequestChange(e) {
		this.setState(() => {
			return { ...this.state, newRequest: e.target.value };
		});
	}

	async handleRemove(e) {
		const friend = e.target.id;
		try {
			const res = await axios({
				method: "post",
				url: "/removefriend",
				data: qs.stringify({
					friend: friend,
				}),
				headers: {
					"content-type": "application/x-www-form-urlencoded;charset=utf-8",
				},
				withCredentials: true,
			});

			if (res.status === 200) {
				//successfully removed friend
				//now make changes to the client side:
				// remove the friend from the state "friends"

				let temp_friendlist = this.state.friends;
				temp_friendlist = temp_friendlist.filter((ele) => {
					return ele !== friend;
				});

				this.setState(() => {
					return { ...this.state, friends: temp_friendlist };
				});
			}
		} catch (e) {
			console.log(e);
		}
	}

	async handleAccept(e) {
		const friend = e.target.id;
		try {
			const res = await axios({
				method: "post",
				url: "/incomingFriend",
				data: qs.stringify({
					friend: friend,
				}),
				headers: {
					"content-type": "application/x-www-form-urlencoded;charset=utf-8",
				},
				withCredentials: true,
			});

			if (res.status === 200) {
				//successfully accepted a new friend request
				//now make changes on the client side:
				//remove friend from the incoming list
				//add friend to the friends list

				let temp_incominglist = this.state.incoming;

				temp_incominglist = temp_incominglist.filter((ele) => {
					return ele !== friend;
				});

				let temp_friendlist = this.state.friends;

				temp_friendlist = temp_friendlist.push(friend);

				this.setState(() => {
					return {
						...this.state,
						incoming: temp_incominglist,
						friend: temp_friendlist,
					};
				});
			}
		} catch (e) {
			console.log(e);
		}
	}

	async handleCancel(e) {
		const friend = e.target.id;
		try {
			const res = await axios({
				method: "post",
				url: "/canceloutgoing",
				data: qs.stringify({
					friend: friend,
				}),
				headers: {
					"content-type": "application/x-www-form-urlencoded;charset=utf-8",
				},
				withCredentials: true,
			});

			if (res.status === 200) {
				//successfully cancelled the outgoing request
				//now remove it from the outgoing list in the state
				let temp_outgoinglist = this.state.outgoing;

				temp_outgoinglist = temp_outgoinglist.filter((ele) => {
					return ele !== friend;
				});

				this.setState(() => {
					return { ...this.state, outgoing: temp_outgoinglist };
				});
			}
		} catch (e) {
			console.log(e);
		}
	}

	async handleNewRequestSet() {
		try {
			const res = await axios({
				method: "post",
				url: "/requestFriend",
				data: qs.stringify({
					friend: this.state.newRequest,
				}),
				headers: {
					"content-type": "application/x-www-form-urlencoded;charset=utf-8",
				},
				withCredentials: true,
			});

			if (res.status === 200) {
				//successfully sent a request to a user
				//now add update the outgoing list

				let temp_outgoinglist = this.state.outgoing;
				temp_outgoinglist.push(this.state.newRequest);

				this.setState(() => {
					return { ...this.state, outgoing: temp_outgoinglist };
				});
			}
		} catch (e) {
			console.log(e);
		}
	}

	async componentDidMount() {
		try {
			let res = await fetchFriends();

			if (!isAllowed) {
				throw Error("cannot fetch");
			}
			//setting the friends list
			this.setState(() => {
				return { ...this.state, friends: res };
			});

			res = await fetchOutgoingList();

			if (!isAllowed) {
				throw Error("cannot fetch");
			}

			//setting the outgoing list
			this.setState(() => {
				return { ...this.state, outgoing: res };
			});

			res = await fetchIncomingList();

			if (!isAllowed) {
				throw Error("cannot fetch");
			}

			//setting the incoming list
			this.setState(() => {
				return { ...this.state, incoming: res };
			});
		} catch (e) {
			this.props.history.push("/login");
		}
	}

	render() {
		return (
			<div className="Friends">
				<div className="module-heading">Friends</div>
				<div className="Friends-items">
					{this.state.friends.map((ele) => {
						return (
							<div key={ele} className="Friends-single-item">
								<img src={avatar} className="Friends-img" />
								<div className="Friends-item-value">{ele}</div>
								<div className="Friends-friends-buttons">
									<div
										className="border-bottom Friends-friend-single-button"
										onClick={() => {
											this.props.history.push(`friendsinfo/${ele}`);
										}}
									>
										Profile
									</div>
									<div
										id={ele}
										onClick={this.handleRemove}
										className="Friends-friend-single-button"
									>
										Remove
									</div>
								</div>
							</div>
						);
					})}
				</div>

				<div className="module-heading">Outgoing Requests</div>
				<div className="Friends-items">
					{this.state.outgoing.map((ele) => {
						return (
							<div key={ele} className="Friends-single-item">
								<img src={avatar} className="Friends-img" />
								<div className="Friends-item-value">{ele}</div>
								<div
									id={ele}
									onClick={this.handleCancel}
									className="Friends-item-button"
								>
									Cancel
								</div>
							</div>
						);
					})}
				</div>
				<div className="module-heading">Incoming Requests</div>
				<div className="Friends-items">
					{this.state.incoming.map((ele) => {
						return (
							<div key={ele} className="Friends-single-item">
								<img src={avatar} className="Friends-img" />
								<div className="Friends-item-value">{ele}</div>
								<div
									id={ele}
									onClick={this.handleAccept}
									className="Friends-item-button"
								>
									Accept
								</div>
							</div>
						);
					})}
				</div>
				<div className="module-heading small-spacer-vertical">Add Friend</div>
				<div className="Friends-NewRequestBlock">
					<input
						type="text"
						name="newRequest"
						id="newRequest"
						onChange={this.handleNewRequestChange}
					/>
					<div className="Friends-submit" onClick={this.handleNewRequestSet}>
						Set
					</div>
				</div>
			</div>
		);
	}
}
