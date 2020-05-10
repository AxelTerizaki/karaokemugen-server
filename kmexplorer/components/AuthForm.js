import React from 'react';
import { i18n, withTranslation } from '../i18n';
import icons from './Icons';
import axios from 'axios';
import Store from '../utils/store';

class AuthForm extends React.Component {
	constructor (props) {
		super(props)
		this.state = {};
		this.store = null;
	}

	confirm = async () => {
		if (this.state.username && this.state.password) {
			let response = await axios.post('/api/auth/login',
				{ username: this.state.username, password: this.state.password });
			if(response.status === 200 && response.data !== null) {
				this.store.setLogInfo(response.data);
				this.props.onClose();
			} else {
				// TODO: give user feedback ("incorrect crendentials" thing)
			}
		}
	}

	componentDidMount() {
		this.store = new Store();
	}

	render() {
		return (
			<div className="kmx-modal-wrapper">
				<div className="kmx-modal-panel">
					<div className="kmx-modal-header">
						<h4>{i18n.t("login_form.title")}</h4>
					</div>
					<div className="kmx-modal-content">
						<div>
							<label>{i18n.t("login_form.username")}</label>
							<input className="kmx-modal-half" required={true} onChange={(e) => this.setState({username: e.target.value})}/>
							<span>@{location.host}</span>
						</div>
						<div>
							<label>{i18n.t("login_form.password")}</label>
							<input required={true} onChange={(e) => this.setState({password: e.target.value})}/>
						</div>
					</div>
					<div className="kmx-modal-footer">
						<button className="kmx-modal-abort" type="button" onClick={this.props.onClose}>
							{icons.abort}
						</button>
						<button className="kmx-modal-confirm" type="submit" onClick={this.confirm}>
							{icons.confirm}
						</button>
					</div>
				</div>
			</div>
		)
	}

}

export default withTranslation('common')(AuthForm)