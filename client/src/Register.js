import React, { Component } from "react";
import axios from "axios";
import "./styles/Register.css";
import Mobile from "./images/undraw_Mobile_login_re_9ntv.svg";
const qs = require("qs");

export default class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			confirmPassword: "",
		};

		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleConfirmPasswordChange =
			this.handleConfirmPasswordChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleUsernameChange(e) {
		this.setState(() => {
			return { ...this.state, username: e.target.value };
		});
	}

	handlePasswordChange(e) {
		this.setState(() => {
			return { ...this.state, password: e.target.value };
		});
	}

	handleConfirmPasswordChange(e) {
		this.setState(() => {
			return { ...this.state, confirmPassword: e.target.value };
		});
	}

	async handleSubmit() {
		//test if password and confirm password are equal

		try {
			if (this.state.password !== this.state.confirmPassword) {
				throw new Error("passwords dont match");
			}

			await axios({
				method: "post",
				url: "/register",
				data: qs.stringify({
					username: this.state.username,
					password: this.state.password,
				}),
				headers: {
					"content-type": "application/x-www-form-urlencoded;charset=utf-8",
				},
				withCredentials: true,
			});
		} catch (e) {
			console.log(e);
		}
	}

	render() {
		return (
			<div className="Register">
				<div className="Register-leftContainer">
					<div className="module-heading large-spacer-vertical">
						"New phone, who dis?"
					</div>
					<img src={Mobile}></img>
				</div>
				<div className="Register-rightContainer">
					<div className="Register-rightContainer-content">
						<div className="module-heading large-spacer-vertical">Register</div>
						<div className="Register-content">
							<div className="large-spacer-vertical">
								<label htmlFor="username">Username</label>
								<br />
								<input
									type="text"
									name="username"
									onChange={this.handleUsernameChange}
								/>
							</div>
							<div className="large-spacer-vertical">
								<label htmlFor="password">Password</label>
								<br />
								<input
									type="password"
									name="password"
									onChange={this.handlePasswordChange}
								/>
							</div>
							<div className="large-spacer-vertical">
								<label htmlFor="confirmpassword">Confirm Password</label>
								<br />
								<input
									type="password"
									name="confirmpassword"
									onChange={this.handleConfirmPasswordChange}
								/>
							</div>
							<div className="large-spacer-vertical">Forgot Password?</div>
							<div className="underlined large-spacer-vertical">
								Don't have an account? Try
								<br />
								registering.
							</div>
						</div>
						<div>
							<button className="submit" onClick={this.handleSubmit}>
								Submit
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
