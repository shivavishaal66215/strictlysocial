import React, { Component } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import explore from "./images/undraw_Explore_re_8l4v.svg";
import avatar from "./images/undraw_male_avatar_323b.svg";
import "./styles/Explore.css";
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

const fetchRecommendations = async () => {
	try {
		const res = await axios({
			method: "post",
			url: "/search",
			headers: {
				"content-type": "application/x-www-form-urlencoded;charset=utf-8",
			},
			withCredentials: true,
		});
		if (res.status === 200) {
			return res.data.data;
		}

		throw new Error("recommendations cannot be fetched now");
	} catch (e) {
		console.log(e);
		return [];
	}
};

export default class Discovery extends Component {
	constructor(props) {
		super(props);

		this.state = {
			recommendations: [],
		};

		this.handleRefresh = this.handleRefresh.bind(this);
		this.handleAddFriend = this.handleAddFriend.bind(this);
	}

	async handleRefresh() {
		const recommendations = await fetchRecommendations();
		this.setState(() => {
			return { ...this.state, recommendations: recommendations };
		});
	}

	async handleAddFriend(e) {
		const friend = e.target.id;
		try {
			const res = await axios({
				method: "post",
				url: "/requestFriend",
				data: qs.stringify({
					friend: e.target.id,
				}),
				headers: {
					"content-type": "application/x-www-form-urlencoded;charset=utf-8",
				},
				withCredentials: true,
			});

			if (res.status === 200) {
				//this means that friend request has been made successfully
				//now remove this item from the recommendations list in state

				let temp_recommendations = this.state.recommendations;
				temp_recommendations = temp_recommendations.filter((ele) => {
					return ele !== friend;
				});

				this.setState(() => {
					return { ...this.state, recommendations: temp_recommendations };
				});
			}
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
		await this.handleRefresh();
	}

	render() {
		return (
			<div className="Explore">
				<Navbar clearState={this.props.clearState} loggedin={true} />
				<div className="Explore-leftcontainer">
					<div className="module-heading large-spacer-vertical">Explore</div>
					<img className="Explore-img" src={explore} />
					<div className="Explore-leftcontainer-content">
						We've done a little bit of good old behind the scenes magic and we
						found some people you might like.
						<br />
						<br />
						Go on then, make new friends.
					</div>
					<div onClick={this.handleRefresh} className="Explore-refresh">
						Refresh
					</div>
				</div>
				<div className="Explore-rightcontainer">
					<div className="Explore-recommendationscontainer">
						{console.log(this.state.recommendations)}
						{this.state.recommendations.map((ele) => {
							return (
								<div key={ele} className="Explore-recommendation">
									<img className="Explore-avatar" src={avatar} />
									<div>{ele}</div>
									<div
										onClick={this.handleAddFriend}
										id={ele}
										className="Explore-add"
									>
										Add
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}
