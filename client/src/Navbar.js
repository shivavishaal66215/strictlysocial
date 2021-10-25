import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Navbar extends Component {
	constructor(props) {
		super(props);

		this.handleLogout = this.handleLogout.bind(this);
	}

	async handleLogout() {
		try {
			await axios({
				method: "post",
				url: "/logout",
				headers: {
					"content-type": "application/x-www-form-urlencoded;charset=utf-8",
				},
				withCredentials: true,
			});

			this.props.clearState();
		} catch (e) {
			console.log("cannot logout right now");
		}
	}

	render() {
		return (
			<div className="Navbar">
				<Link to="/">Home</Link>
				<Link to="/login">Login</Link>
				<Link to="/register">Register</Link>
				<Link to="/interests">Interests</Link>
				<Link to="/friends">Friends</Link>
				<Link to="/explore">Explore</Link>
				<Link to="/profile">Profile</Link>
				<Link to="/changepassword">ChangePassword</Link>
				<Link to="/friendsinfo">FriendsInfo</Link>
				<button onClick={this.handleLogout}>Logout</button>
			</div>
		);
	}
}
