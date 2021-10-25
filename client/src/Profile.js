import React, { Component } from "react";
import axios from "axios";
const qs = require("qs");
export default class Profile extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: this.props.username,
			email: "",
			phone: "",
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

	componentDidMount() {
		this.setState(() => {
			return {
				...this.state,
				email: this.props.email,
				phone: this.props.phone,
			};
		});
	}

	render() {
		return (
			<div>
				<div>
					<h3>Username</h3>
					<div>{this.state.username}</div>
				</div>
				<div>
					<h3>Email</h3>
					<div>{this.state.email}</div>
					<label>New Email: </label>
					<input
						type="text"
						name="email"
						id="email"
						onChange={this.handleEmailChange}
					/>
					<button onClick={this.handleEmailSet}>Set</button>
				</div>
				<div>
					<h3>Phone</h3>
					<div>{this.state.phone}</div>
					<label>New Phone: </label>
					<input
						type="text"
						name="phone"
						id="phone"
						onChange={this.handlePhoneChange}
					/>
					<button onClick={this.handlePhoneSet}>Set</button>
				</div>
				<button onClick={this.handleSave}>Save</button>
			</div>
		);
	}
}
