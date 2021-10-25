import React, { Component } from "react";
import axios from "axios";
const qs = require("qs");

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
		return res.data;
	} catch (e) {
		console.log("cannot fetch friends");
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
		return res.data;
	} catch (e) {
		console.log("cannot fetch outgoing list");
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
		return res.data;
	} catch (e) {
		console.log("cannot fetch outgoing list");
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

			//setting the friends list
			this.setState(() => {
				return { ...this.state, friends: res };
			});

			res = await fetchOutgoingList();

			//setting the outgoing list
			this.setState(() => {
				return { ...this.state, outgoing: res };
			});

			res = await fetchIncomingList();

			//setting the incoming list
			this.setState(() => {
				return { ...this.state, incoming: res };
			});
		} catch (e) {
			console.log("something went wrong");
		}
	}

	render() {
		return (
			<div>
				<h1>Friends: </h1>
				<ul>
					{this.state.friends.map((ele) => {
						return (
							<div key={ele}>
								<li>{ele}</li>
								<button id={ele} onClick={this.handleRemove}>
									Remove
								</button>
							</div>
						);
					})}
				</ul>
				<div>
					<label htmlFor="newRequest">New Request</label>
					<input
						type="text"
						name="newRequest"
						id="newRequest"
						onChange={this.handleNewRequestChange}
					/>
					<button onClick={this.handleNewRequestSet}>Set</button>
				</div>
				<div>
					<h3>Outgoing Requests:</h3>
					<ul>
						{this.state.outgoing.map((ele) => {
							return (
								<div key={ele}>
									<li>{ele}</li>
									<button id={ele} onClick={this.handleCancel}>
										Cancel
									</button>
								</div>
							);
						})}
					</ul>
				</div>
				<div>
					<h3>Incoming Requests:</h3>
					<ul>
						{this.state.incoming.map((ele) => {
							return (
								<div key={ele}>
									<li>{ele}</li>
									<button id={ele} onClick={this.handleAccept}>
										Accept
									</button>
								</div>
							);
						})}
					</ul>
				</div>
			</div>
		);
	}
}
