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
				{!this.props.loggedin ? (
					<span className="Navbar-items">
						<Link to="/login" className="Navbar-item">
							Login
						</Link>
						<Link to="/register" className="Navbar-item">
							Register
						</Link>
					</span>
				) : (
					<span className="Navbar-items">
						<Link to="/" className="Navbar-item">
							Profile
						</Link>
						<Link to="/changepassword" className="Navbar-item">
							ChangePassword
						</Link>
						<span onClick={this.handleLogout} className="Navbar-item logout">
							Logout
						</span>
					</span>
				)}
			</div>
		);
	}
}
