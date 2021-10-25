import React, { Component } from "react";
import axios from "axios";
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
			<div>
				<div>
					<label htmlFor="username">Username</label>
					<input
						type="text"
						name="username"
						onChange={this.handleUsernameChange}
					/>
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						onChange={this.handlePasswordChange}
					/>
				</div>
				<div>
					<label htmlFor="confirmPassword">Confirm Password</label>
					<input
						type="password"
						name="confirmPassword"
						onChange={this.handleConfirmPasswordChange}
					/>
				</div>
				<div>
					<button onClick={this.handleSubmit}>Submit</button>
				</div>
			</div>
		);
	}
}
