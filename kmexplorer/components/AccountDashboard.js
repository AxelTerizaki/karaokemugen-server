import React from 'react';
import { i18n, withTranslation } from '../i18n';
import icons from './Icons';
import Store from '../utils/store';
import EventSystem from '../utils/eventSystem';

class AccountDashboard extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			dropdown:{
				userActions:false,
			},
			modal:{
				deleteConfirm:false,
			},
			store: null,
			loggedIn: false
		}
	}

	componentDidMount() {
		let store = new Store();
		EventSystem.subscribe('loginUpdated', () => {
			this.refreshAuth();
		});
		this.setState({loggedIn: store.isLoggedIn(), store});
	}

	toggleDropdown(k){
		let dropdown = this.state.dropdown;
		dropdown[k] = !dropdown[k];
		this.setState({dropdown})
	}
	closeDropdown(k){
		let dropdown = this.state.dropdown;
		dropdown[k] = false;
		this.setState({dropdown})
	}
	openModal(k){
		let modal = this.state.modal;
		modal[k] = true;
		this.setState({modal})
	}
	closeModal(k){
		let modal = this.state.modal;
		modal[k] = false;
		this.setState({modal})
	}
	refreshAuth() {
		// Recreate the store
		let store = new Store();
		this.setState({loggedIn: store.isLoggedIn(), store});
	}

	render() {
		return (
			<div>
				<button onClick={this.openModal.bind(this,'deleteConfirm')}>{icons.delete} Supprimer le compte</button>
			</div>
		);
	}
}

export default withTranslation('common')(AccountDashboard);