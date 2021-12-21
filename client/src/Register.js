import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "./styles/Register.css";
import Mobile from "./images/undraw_Mobile_login_re_9ntv.svg";
const qs = require("qs");

//TODO: Make sure usernames are less than 15chars long. UI breaks for longer names

export default class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			confirmPassword: "",
			error: false,
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

			this.setState(
				() => {
					return { ...this.state, error: false };
				},
				() => {
					this.props.history.push("/profile");
				}
			);
		} catch (e) {
			this.setState(() => {
				return { ...this.state, error: true };
			});
			return;
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
					<Navbar clearState={this.props.clearState} loggedin={false} />
					<div className="Register-rightContainer-content">
						<div className="module-heading large-spacer-vertical">Register</div>
						{this.state.error ? (
							<div className="large-spacer-vertical error-message">
								Username already exists or passwords <br />
								don't match
							</div>
						) : (
							<div></div>
						)}
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
							<Link to="/login">
								<div className="underlined large-spacer-vertical">
									Already have an account? Try
									<br />
									logging in.
								</div>
							</Link>
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
