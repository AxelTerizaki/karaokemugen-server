import React from 'react';
import { i18n, withTranslation } from '../i18n';
import icons from './Icons';
import AuthForm from './AuthForm';
import Store from '../utils/store';
import Link from '../utils/I18nLink';

class AuthButtons extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			dropdown:{
				userActions:false,
			},
			modal:{
				login:false,
			},
			store: null,
			loggedIn: false
		}
	}

	componentDidMount() {
		let store = new Store();
		this.setState({loggedIn: store.isLoggedIn(), store});
	}

	toggleDropdown(k){
		let dropdown = this.state.dropdown;
		dropdown[k] = !dropdown[k];
		this.setState({dropdown:dropdown})
	}
	closeDropdown(k){
		let dropdown = this.state.dropdown;
		dropdown[k] = false;
		this.setState({dropdown:dropdown})
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
		this.setState({store});
	}

	render() {
		return (
			<div className="kmx-login-menu">
				<dl>
					<dd key="login">
						{
							this.state.loggedIn ?
							<button onClick={this.toggleDropdown.bind(this,'userActions')}>{icons.user} Salut {this.state.store.getLogInfos().username}</button>:
							<button onClick={this.openModal.bind(this,'login')}>{icons.user} {i18n.t('login')}</button>
						}
						{this.state.modal.login ? <AuthForm onClose={() => {this.closeModal('login'); this.refreshAuth();}} />:null}
						{
							this.state.dropdown.userActions
								? <dl className="kmx-filters-menu--dropdown">
									<dd onClick={this.closeDropdown.bind(this,'userActions')}><a className="">test</a></dd>
								</dl>
								: null
						}
					</dd>
				</dl>
			</div>
		);
	}
}

export default AuthButtons;