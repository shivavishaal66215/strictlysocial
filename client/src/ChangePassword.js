import React, { Component } from "react";
import axios from "axios";
import "./styles/ChangePassword.css";
import my_password from "./images/undraw_my_password_d6kg.svg";
import Navbar from "./Navbar";
const qs = require("qs");

const checkCorrectUsername = async () => {
	const username = localStorage.getItem("username");

	//checking if username is even set
	if (username === null || username === undefined || username === "") {
		return false;
	}

	try {
		const res = await axios({
			method: "get",
			url: "/myProfile",
			headers: {
				"content-type": "application/x-www-form-urlencoded;charset=utf-8",
			},
			withCredentials: true,
		});

		//checking if session username matches current username
		//if not, make the user re-login
		if (res.data.username !== username) {
			throw Error("wrong user");
		}
	} catch (e) {
		return false;
	}

	return true;
};

export default class ChangePassword extends Component {
	constructor(props) {
		super(props);

		this.state = {
			old: "",
			new: "",
			new_confirm: "",
		};

		this.handleOldChange = this.handleOldChange.bind(this);
		this.handleNewChange = this.handleNewChange.bind(this);
		this.handleNewConfirmChange = this.handleNewConfirmChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleOldChange(e) {
		this.setState(() => {
			return { ...this.state, old: e.target.value };
		});
	}

	handleNewChange(e) {
		this.setState(() => {
			return { ...this.state, new: e.target.value };
		});
	}

	handleNewConfirmChange(e) {
		this.setState(() => {
			return { ...this.state, new_confirm: e.target.value };
		});
	}

	async handleSubmit() {
		/*
		Todo:
		1. Check on the client side if both new password and old password match
		2. If yes,
			1. make an api call to change password
		3. Else,
			1. throw an error
		*/

		try {
			//checking if passwords match [new and new_confirm]
			if (this.state.new !== this.state.new_confirm) {
				//they dont match
				throw Error("passwords dont match");
			}

			//making an api call to change the password
			await axios({
				method: "post",
				url: "/password",
				data: qs.stringify({
					password: this.state.old,
					newPassword: this.state.new,
				}),
				headers: {
					"content-type": "application/x-www-form-urlencoded;charset=utf-8",
				},
				withCredentials: true,
			});

			this.props.setUsername(this.state.username);
		} catch (e) {
			console.log(e.message);
		}
	}

	async componentDidMount() {
		const result = await checkCorrectUsername();
		if (!result) {
			this.props.history.push("/login");
			return;
		}
	}

	render() {
		return (
			<div className="ChangePassword">
				<Navbar clearState={this.props.clearState} loggedin={true} />
				<div className="ChangePassword-rightContainer">
					<div className="ChangePassword-rightContainer-content">
						<div className="module-heading large-spacer-vertical">Password</div>
						<div className="ChangePassword-content">
							<div className="large-spacer-vertical">
								<label htmlFor="old">Old Password</label>
								<br />
								<input type="text" name="old" onChange={this.handleOldChange} />
							</div>
							<div className="large-spacer-vertical">
								<label htmlFor="new">New Password</label>
								<br />
								<input
									type="password"
									name="new"
									onChange={this.handleNewChange}
								/>
							</div>
							<div className="large-spacer-vertical">
								<label htmlFor="confirmpassword">Confirm New Password</label>
								<br />
								<input
									type="password"
									name="new_confirm"
									onChange={this.handleNewConfirmChange}
								/>
							</div>
						</div>
						<div>
							<button className="submit" onClick={this.handleSubmit}>
								Submit
							</button>
						</div>
					</div>
				</div>
				<div className="ChangePassword-leftContainer">
					<img src={my_password}></img>
				</div>
			</div>
		);
	}
}
