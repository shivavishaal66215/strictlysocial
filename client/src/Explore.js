import React, { Component } from "react";

import axios from "axios";
const qs = require("qs");
/*
TODO
1. Section containing recommendations based on interests
*/

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
			return res.data;
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
		await this.handleRefresh();
	}

	render() {
		return (
			<div>
				<h1>Recommendations</h1>
				<ul>
					{this.state.recommendations.map((ele) => {
						return (
							<li key={ele}>
								<span>{ele}</span>
								<button onClick={this.handleAddFriend} id={ele}>
									Add friend
								</button>
							</li>
						);
					})}
				</ul>
				<button onClick={this.handleRefresh}>Refresh</button>
			</div>
		);
	}
}
