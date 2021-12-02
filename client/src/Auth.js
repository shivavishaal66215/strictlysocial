import React, { Component } from "react";
import { Redirect } from "react-router";

export default class Auth extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isAuthenticated: false,
		};

		this.setAuthenticated = this.setAuthenticated.bind(this);
	}

	setAuthenticated(val) {
		this.setState(() => {
			return { ...this.state, isAuthenticated: val };
		});
	}

	render() {
		return this.state.isAuthenticated ? (
			this.props.component
		) : (
			<Redirect to="/login" />
		);
	}
}
