import React, { Component } from "react";
import axios from "axios";
import avatar from "./images/undraw_male_avatar_323b.svg";
import "./styles/Profile.css";
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

export default class Profile extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: this.props.username,
			email: this.props.email,
			phone: this.props.phone,
			newEmail: "",
			newPhone: "",
		};

		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handlePhoneChange = this.handlePhoneChange.bind(this);
		this.handleEmailSet = this.handleEmailSet.bind(this);
		this.handlePhoneSet = this.handlePhoneSet.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	handleEmailChange(e) {
		const newEmail = e.target.value;
		this.setState(() => {
			return { ...this.state, newEmail: newEmail };
		});
	}

	handlePhoneChange(e) {
		const newPhone = e.target.value;
		this.setState(() => {
			return { ...this.state, newPhone: newPhone };
		});
	}

	handleEmailSet() {
		const newEmail = this.state.newEmail;
		this.setState(() => {
			return { ...this.state, email: newEmail };
		});
	}

	handlePhoneSet() {
		const newPhone = this.state.newPhone;
		this.setState(() => {
			return { ...this.state, phone: newPhone };
		});
	}

	async handleSave() {
		try {
			//setting the phone
			let res = await axios({
				method: "post",
				url: "/phone",
				data: qs.stringify({
					phone: this.state.phone,
				}),
				headers: {
					"content-type": "application/x-www-form-urlencoded;charset=utf-8",
				},
				withCredentials: true,
			});

			//setting the email
			res = await axios({
				method: "post",
				url: "/email",
				data: qs.stringify({
					email: this.state.email,
				}),
				headers: {
					"content-type": "application/x-www-form-urlencoded;charset=utf-8",
				},
				withCredentials: true,
			});

			console.log(res);
		} catch (e) {
			console.log(e);
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
			<div className="Profile">
				<div className="Profile-banner">
					<img className="Profile-avatar" src={avatar} />
					<div className="Profile-banner-right">
						<div className="module-heading">{this.props.username}</div>
						<div className="Profile-sidebar">
							<div className="Profile-sidebar-content">Explore</div>
							<div className="Profile-sidebar-content">Friends</div>
							<div className="Profile-sidebar-content">Interests</div>
						</div>
					</div>
				</div>
				<div className="Profile-content">
					<div className="Profile-subcontent">
						<div className="module-heading Profile-large-spacing">Email</div>
						<div className="Profile-subcontent-content">
							<div className="Profile-current Profile-small-spacing">
								<div className="underlined">Current Email:</div>
								<div className="Profile-current-value">{this.props.email}</div>
							</div>
							<div>
								<label>New Email: </label>
								<input
									className="Profile-input"
									type="text"
									name="email"
									id="email"
									onChange={this.handleEmailChange}
								/>
								<button onClick={this.handleEmailSet} className="submit">
									Edit
								</button>
							</div>
						</div>
					</div>

					<div className="Profile-subcontent">
						<div className="module-heading Profile-large-spacing">Phone</div>
						<div className="Profile-subcontent-content">
							<div className="Profile-current Profile-small-spacing">
								<div className="underlined">Current Phone:</div>
								<div className="Profile-current-value">{this.state.phone}</div>
							</div>
							<div>
								<label>New Phone: </label>
								<input
									className="Profile-input"
									type="text"
									name="phone"
									id="phone"
									onChange={this.handlePhoneChange}
								/>
								<button onClick={this.handlePhoneSet} className="submit">
									Edit
								</button>
							</div>
						</div>
					</div>
				</div>
				<button onClick={this.handleSave} className="submit Profile-submit">
					Save
				</button>
			</div>
		);
	}
}
