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

export default class FriendsInfo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			friends: [],
			curFriend: {
				username: "",
				email: "",
				phone: "",
			},
		};

		this.handleInfo = this.handleInfo.bind(this);
	}

	async componentDidMount() {
		const friends = await fetchFriends();
		this.setState(() => {
			return { ...this.state, friends: friends };
		});
	}

	async handleInfo(e) {
		const friend = e.target.id;
		try {
			//fetching the target's profile
			const res = await axios({
				method: "post",
				url: "/getUserProfile",
				data: qs.stringify({
					username: friend,
				}),
				headers: {
					"content-type": "application/x-www-form-urlencoded;charset=utf-8",
				},
				withCredentials: true,
			});

			this.setState(() => {
				return {
					...this.state,
					curFriend: res.data,
				};
			});
		} catch (e) {
			console.log("cannot fetch details now");
		}
	}

	render() {
		return (
			<div>
				<h1>Friends</h1>
				<ul>
					{this.state.friends.map((ele) => {
						return (
							<li key={ele}>
								<span>{ele}</span>
								<button onClick={this.handleInfo} id={ele}>
									View Info
								</button>
							</li>
						);
					})}
				</ul>
				<div>
					<h3>Username</h3>
					<div>{this.state.curFriend.username}</div>
					<h3>Phone</h3>
					<div>{this.state.curFriend.phone}</div>
					<h3>Email</h3>
					<div>{this.state.curFriend.email}</div>
				</div>
			</div>
		);
	}
}
