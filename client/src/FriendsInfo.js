import React, { Component } from "react";
import axios from "axios";
import avatar from "./images/undraw_male_avatar_323b.svg";
import "./styles/Profile.css";
const qs = require("qs");

export default class FriendsInfo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: "",
			email: "",
			phone: "",
		};
	}

	async componentDidMount() {
		let res;
		console.log(this.props.match.params.id);
		try {
			res = await axios({
				method: "post",
				url: "/getUserProfile",
				data: qs.stringify({
					friend: this.props.match.params.id,
				}),
				headers: {
					"content-type": "application/x-www-form-urlencoded;charset=utf-8",
				},
				withCredentials: true,
			});
			console.log(res);
			this.setState(() => {
				return {
					...this.state,
					username: res.data.username,
					email: res.data.email,
					phone: res.data.phone,
				};
			});
		} catch (e) {
			alert("invalid");
		}
	}

	render() {
		return (
			<div className="Profile">
				<div className="Profile-banner">
					<img className="Profile-avatar" src={avatar} />
					<div className="Profile-banner-right">
						<div className="module-heading">{this.state.username}</div>
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
								<div className="Profile-current-value">{this.state.email}</div>
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
						</div>
					</div>
				</div>
			</div>
		);
	}
}
