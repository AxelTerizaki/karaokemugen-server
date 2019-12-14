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
			username : "",
			series: "",
			link: ""
		}
	}

	confirm = async () => {
		if (this.state.karaTitle) {
			var response = await axios.post(API_URL+'/api/karas/suggest', 
				{ karaName: this.state.karaTitle, username: this.state.username, series : this.state.series, link: this.state.link})
			if(response.status===200 && response.data.issueURL !==null)
			{
				this.props.onClose();
			}
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
							<label>{i18n.t("modal.name")}</label>
							<input required={true} onChange={(e) => this.setState({karaTitle: e.target.value})}/>
						</div>
						<div>
							<label>{i18n.t("modal.username")}</label>
							<input onChange={(e) => this.setState({username: e.target.value})}/>
						</div>
						<div>
							<label>{i18n.t("modal.series")}</label>
							<input onChange={(e) => this.setState({series: e.target.value})}/>
						</div>
						<div>
							<label>{i18n.t("modal.link")}</label>
							<input onChange={(e) => this.setState({link: e.target.value})}/>
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

export default withTranslation('common')(Modal)
