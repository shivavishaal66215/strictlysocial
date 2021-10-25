import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import Interests from "./Interests";
import Friends from "./Friends";
import Explore from "./Explore";
import Profile from "./Profile";
import axios from "axios";
import ChangePassword from "./ChangePassword";
import FriendsInfo from "./FriendsInfo";

import "./styles/App.css";

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: "",
			email: "",
			phone: "",
		};

		this.setUsername = this.setUsername.bind(this);
	}

	setUsername(newUsername) {
		this.setState(() => {
			return { ...this.state, username: newUsername };
		});
		this.componentDidMount();
	}

	clearState() {
		this.setState(() => {
			return { ...this.state, username: "", email: "", phone: "" };
		});
	}

	async componentDidMount() {
		try {
			const res = await axios({
				method: "get",
				url: "/myProfile",
				headers: {
					"content-type": "application/x-www-form-urlencoded;charset=utf-8",
				},
				withCredentials: true,
			});
			//successfully fetched username
			this.setState(() => {
				return {
					...this.state,
					username: res.data.username,
					phone: res.data.phone,
					email: res.data.email,
				};
			});
		} catch (e) {
			console.log("not logged in");
		}
	}

	render() {
		return (
			<div className="App">
				<Navbar clearState={this.clearState} />
				<Switch>
					<Route exact path="/" component={() => <Home />} />
					<Route
						exact
						path="/login"
						component={() => <Login setUsername={this.setUsername} />}
					/>
					<Route exact path="/register" component={() => <Register />} />
					<Route exact path="/dashboard" component={() => <Dashboard />} />
					<Route exact path="/interests" component={() => <Interests />} />
					<Route exact path="/friends" component={() => <Friends />} />
					<Route exact path="/explore" component={() => <Explore />} />
					<Route
						exact
						path="/profile"
						component={() => (
							<Profile
								username={this.state.username}
								email={this.state.email}
								phone={this.state.phone}
							/>
						)}
					/>
					<Route
						exact
						path="/changepassword"
						component={() => <ChangePassword />}
					/>
					<Route
						exact
						path="/friendsinfo"
						component={() => <FriendsInfo username={this.state.username} />}
					/>
				</Switch>
			</div>
		);
	}
}
