import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Navbar from "./Navbar";
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
			isAuthenticated: false,
		};

		this.setUsername = this.setUsername.bind(this);
		this.clearState = this.clearState.bind(this);
	}

	async setUsername(newUsername) {
		this.setState(
			() => {
				return { ...this.state, username: newUsername };
			},
			() => {
				localStorage.setItem("username", this.state.username);
			}
		);
		this.componentDidMount();
	}

	clearState() {
		this.setState(
			() => {
				return {
					...this.state,
					username: "",
					email: "",
					phone: "",
					isAuthenticated: false,
				};
			},
			() => {
				localStorage.setItem("username", "");
			}
		);
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
			this.setState(
				() => {
					return {
						...this.state,
						username: res.data.username,
						phone: res.data.phone,
						email: res.data.email,
						isAuthenticated: true,
					};
				},
				() => {
					localStorage.setItem("username", this.state.username);
				}
			);
		} catch (e) {
			console.log("not logged in");
		}
	}

	render() {
		return (
			<div className="App">
				{/* <Navbar clearState={this.clearState} /> */}
				<Switch>
					<Route
						exact
						path="/"
						component={(routerProps) => (
							<Profile
								username={this.state.username}
								email={this.state.email}
								phone={this.state.phone}
								{...routerProps}
								clearState={this.clearState}
							/>
						)}
					/>
					<Route
						exact
						path="/login"
						component={(routerProps) => (
							<Login
								setUsername={this.setUsername}
								{...routerProps}
								clearState={this.clearState}
							/>
						)}
					/>
					<Route
						exact
						path="/register"
						component={(router) => <Register {...router} />}
						clearState={this.clearState}
					/>
					<Route
						exact
						path="/interests"
						component={(routerProps) => (
							<Interests {...routerProps} clearState={this.clearState} />
						)}
					/>
					<Route
						exact
						path="/friends"
						component={(routerProps) => (
							<Friends {...routerProps} clearState={this.clearState} />
						)}
					/>
					<Route
						exact
						path="/explore"
						component={(routerProps) => (
							<Explore {...routerProps} clearState={this.clearState} />
						)}
					/>
					<Route
						exact
						path="/profile"
						component={(routerProps) => (
							<Profile
								username={this.state.username}
								email={this.state.email}
								phone={this.state.phone}
								{...routerProps}
								clearState={this.clearState}
							/>
						)}
					/>
					<Route
						exact
						path="/changepassword"
						component={(routerProps) => (
							<ChangePassword {...routerProps} clearState={this.clearState} />
						)}
					/>
					<Route
						path="/friendsinfo/:id"
						component={(routeProps) => (
							<FriendsInfo
								username={this.state.username}
								{...routeProps}
								clearState={this.clearState}
							/>
						)}
					/>
				</Switch>
			</div>
		);
	}
}
