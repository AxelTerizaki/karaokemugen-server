import React from 'react';
import { i18n, withTranslation } from '../i18n';
import Head from 'next/head';
import AccountDashboard from '../components/AccountDashboard';
import Store from '../utils/store';
import EventSystem from '../utils/eventSystem';

class Page extends React.Component {
	static async getInitialProps({ req, query, res }) {
		let namespacesRequired = ['common'];

		return { namespacesRequired };
	}

	constructor(props) {
		super(props);
		this.state = {
			store: null,
			loggedIn: false,
			init: false
		};
	}

	componentDidMount() {
		let store = new Store();
		EventSystem.subscribe('loginUpdated', () => {
			this.refreshAuth();
		});
		this.setState({loggedIn: store.isLoggedIn(), store});
	}

	refreshAuth() {
		// Recreate the store
		let store = new Store();
		this.setState({loggedIn: store.isLoggedIn(), store});
	}

	render() {
		return (
			<div>
				<Head>
					<title key="title">{i18n.t('sitename')} - {i18n.t('category.home')}</title>
				</Head>

				{
					this.state.loggedIn ?
						<AccountDashboard />:
						<p>Connectez-vous, bon de dieu !</p>
				}
			</div>
		);
	}
}

export default withTranslation('common')(Page);