import React from 'react';
import { i18n, withTranslation } from '../i18n';
import icons from './Icons';
import AuthForm from './AuthForm';
import Store from '../utils/store';
import EventSystem from '../utils/eventSystem';
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
			loggedIn: false,
			init: false
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
	logout() {
		this.state.store.logOut();
		this.closeDropdown('userActions');
	}

	render() {
		return (
			<div className="kmx-filters-menu">
				<dl className="kmx-filters-menu--list">
					<dd key="login" className={this.props.current_route=="/account" ? "active":"inactive"}>
						{
							this.state.loggedIn ?
							<button onClick={this.toggleDropdown.bind(this,'userActions')}>{icons.user} {this.state.store.getLogInfos().username}</button>:
							<button onClick={this.openModal.bind(this,'login')}>{icons.user} {i18n.t('login')}</button>
						}
						{this.state.modal.login ? <AuthForm onClose={() => {this.closeModal('login'); this.refreshAuth();}} />:null}
						{
							this.state.dropdown.userActions ?
								<dl className="kmx-filters-menu--dropdown">
									<dd onClick={() => this.closeDropdown('userActions')}><Link href={ "/account" }><a>{icons.user} {i18n.t('my_account.title')}</a></Link></dd>
									<dd onClick={() => this.logout()}><a>{icons.logout} {i18n.t('logout')}</a></dd>
								</dl>
								:null
						}
					</dd>
				</dl>
			</div>
		);
	}
}

export default withTranslation('common')(AuthButtons);