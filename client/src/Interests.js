import React, { Component } from "react";
import axios from "axios";
import "./styles/Interests.css";
import avatar from "./images/undraw_male_avatar_323b.svg";
const qs = require("qs");

const startsWithString = (source1, target1) => {
	if (target1.length > source1.length) {
		return false;
	}

	const source = source1.toLowerCase();
	const target = target1.toLowerCase();

	for (let i = 0; i < target.length; i++) {
		if (source[i] !== target[i]) {
			return false;
		}
	}

	return true;
};

const extract = (source) => {
	let result = "";
	for (let i = 3; i < source.length; i++) {
		result += source[i];
	}

	return result;
};

//fetches interests for the current user logged in
const fetchInterests = async () => {
	try {
		const res = await axios({
			method: "get",
			url: "/interest",
			headers: {
				"content-type": "application/x-www-form-urlencoded;charset=utf-8",
			},
			withCredentials: true,
		});
		return res;
	} catch (e) {
		const res = {
			data: [],
		};
		return res;
	}
};

//fetches list of all the available interests in the system
const fetchAllInterests = async () => {
	try {
		const res = await axios({
			method: "get",
			url: "/allInterests",
			headers: {
				"content-type": "application/x-www-form-urlencoded;charset=utf-8",
			},
			withCredentials: true,
		});
		return res.data;
	} catch (e) {
		const res = [];
		return res;
	}
};

const isNotAlreadyPresent = (arr, a) => {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === a) {
			return false;
		}
	}

	return true;
};

const convertToCommaSeparated = (interests) => {
	if (interests.length === 0) {
		return "";
	}

	let result = "";

	let i = 0;
	for (i = 0; i < interests.length - 1; i++) {
		result += interests[i];
		result += ",";
	}

	result += interests[interests.length - 1];
	return result;
};

export default class Interests extends Component {
	constructor(props) {
		super(props);
		this.state = {
			interest: [],
			newItem: "",
			allInterests: [],
			searchItem: "",
			targetInterests: [],
		};

		this.handleSaveInterests = this.handleSaveInterests.bind(this);
		this.handleNewItemSet = this.handleNewItemSet.bind(this);
		this.handleRemoveItem = this.handleRemoveItem.bind(this);
		this.handleSearchChange = this.handleSearchChange.bind(this);
	}

	async componentDidMount() {
		this._isMounted = true;
		const res = await fetchInterests();
		const r = await fetchAllInterests();
		if (this._isMounted) {
			this.setState(() => {
				return {
					...this.state,
					interest: res.data,
					allInterests: r,
					targetInterests: r,
				};
			});
		}
	}
	componentWillUnmount() {
		this._isMounted = false;
	}

	async handleSaveInterests() {
		const interests = convertToCommaSeparated(this.state.interest);
		try {
			const res = await axios({
				method: "post",
				url: "/setInterest",
				data: qs.stringify({
					interest: interests,
				}),
				headers: {
					"content-type": "application/x-www-form-urlencoded;charset=utf-8",
				},
				withCredentials: true,
			});
			return res;
		} catch (e) {
			alert("something went wrong");
		}
	}

	handleRemoveItem(e) {
		const itemToRemove = e.target.id;

		let interests = this.state.interest;

		interests = interests.filter((ele) => {
			return ele !== itemToRemove;
		});

		this.setState(() => {
			return { ...this.state, interest: interests };
		});
	}

	handleNewItemSet(e) {
		const newItem = extract(e.target.id);
		//trim to remove the null spaces so it is sufficient to check for a null string
		if (newItem !== "" && isNotAlreadyPresent(this.state.interest, newItem)) {
			let newArr = this.state.interest;
			newArr.push(newItem);
			this.setState(() => {
				return { ...this.state, interest: newArr };
			});
		} else {
			alert("Invalid");
		}
	}

	handleSearchChange(e) {
		this.setState(
			() => {
				return { ...this.state, searchItem: e.target.value };
			},
			() => {
				const target = this.state.searchItem;
				const res = this.state.allInterests.filter((ele) => {
					return startsWithString(ele, target);
				});

				this.setState(() => {
					return { ...this.state, targetInterests: res };
				});
			}
		);
	}

	render() {
		return (
			<div className="Interests">
				<div className="Interests-leftcontainer">
					<img src={avatar} />
					<div className="top-line"></div>
					<div className="Interests-leftcontainer-heading">My Interests</div>
					<div className="bottom-line"></div>
					<div className="Interests-interests">
						{this.state.interest.map((ele) => {
							// key here is set to each interest element since they are all unique
							return (
								<div key={ele} className="Interests-item">
									<span>{ele}</span>
									<div className="Interests-item-verticalline"></div>
									<div
										className="Interests-remove"
										id={ele}
										onClick={this.handleRemoveItem}
									>
										x
									</div>
								</div>
							);
						})}
					</div>
					<div
						className="submit Interests-button"
						onClick={this.handleSaveInterests}
					>
						Save Interests
					</div>
				</div>
				<div className="Interests-rightContainer">
					<div className="module-heading Interests-rightContainer-heading small-spacer-vertical">
						Interests
					</div>
					<input
						type="text"
						name="searchItem"
						id="searchItem"
						placeholder="Search"
						onChange={this.handleSearchChange}
					/>
					<div className="Interests-all-searchItems">
						{this.state.targetInterests.map((ele) => {
							return (
								<div className="Interests-search-item" key={`all_${ele}`}>
									<div className="Interests-search-item-value">{ele}</div>
									<div
										className="Interests-add-button"
										id={`tb_${ele}`}
										onClick={this.handleNewItemSet}
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
