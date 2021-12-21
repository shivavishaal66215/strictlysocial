import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import fingerprint from "./images/undraw_Fingerprint_re_uf3f.svg";
import "./styles/Login.css";
const qs = require("qs");

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			error: false,
		};

		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
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

	async handleLogin() {
		try {
			await axios({
				method: "post",
				url: "/login",
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
				async () => {
					await this.props.setUsername(this.state.username);
					this.props.history.push("/profile");
				}
			);
		} catch (e) {
			this.setState(() => {
				return { ...this.state, error: true };
			});
		}
	}

	render() {
		return (
			<div className="Login">
				<div className="Login-leftContainer">
					<div className="module-heading large-spacer-vertical">
						You know what to do...
					</div>
					<img src={fingerprint}></img>
				</div>
				<div className="Login-rightContainer">
					<Navbar clearState={this.props.clearState} loggedin={false} />
					<div className="Login-rightContainer-content">
						<div className="module-heading large-spacer-vertical">Login</div>
						{this.state.error ? (
							<div className="large-spacer-vertical error-message">
								Invalid Credentials
							</div>
						) : (
							<div></div>
						)}
						<div className="Login-content">
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
							<div className="large-spacer-vertical">Forgot Password?</div>
							<Link to="/register">
								<div className="underlined large-spacer-vertical">
									Don't have an account? Try
									<br />
									registering.
								</div>
							</Link>
						</div>
						<div>
							<button className="submit" onClick={this.handleLogin}>
								Submit
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
