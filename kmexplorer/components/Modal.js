import React from 'react'
import { i18n, withTranslation } from '../i18n'
import icons from '../components/Icons';
import axios from 'axios'
import RuntimeConfig from '../utils/RuntimeConfig';
const API_URL = RuntimeConfig.API_URL;

class Modal extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			karaTitle : "",
			username : ""
		}
	}

	confirm = async () => {
		if (this.state.karaTitle && this.state.username) {
			var response = await axios.post(API_URL+'/api/karas/suggest', { karaName: this.state.karaTitle, username: this.state.username })
			if(response.status===200 && response.data.issueURL !==null)
			{
				this.props.onClose();
			}
		} else {
			this.props.onClose();
		}
	}

	render() {
		return (
			<div className="kmx-modal-wrapper">
				<div className="kmx-modal-panel">
					<div className="kmx-modal-header">
						<h4>{i18n.t("modal.title")}</h4>
					</div>
					<div className="kmx-modal-content">
						<div>
							<label>{i18n.t("modal.kara_suggestion_name")}</label>
							<input required={true} onChange={(e) => this.setState({karaTitle: e.target.value})}/>
						</div>
						<div>
							<label>{i18n.t("modal.username")}</label>
							<input required={true} onChange={(e) => this.setState({username: e.target.value})}/>
						</div>
					</div>
					<div className="kmx-modal-footer">
						<button className="kmx-modal-abort" type="button" onClick={this.props.onClose}>
							{icons.abort}
						</button>
						<button className="kmx-modal-confirm" type="button" onClick={this.confirm}>
							{icons.confirm}
						</button>
					</div>
				</div>
			</div>
		)
	}
}

export default withTranslation('common')(Modal)
