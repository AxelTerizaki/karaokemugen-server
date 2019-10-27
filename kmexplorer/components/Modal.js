import React from 'react'
import { i18n, withTranslation } from '../i18n'
import icons from '../components/Icons';
import axios from 'axios'

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
			var response = await axios.get(API_URL+'/api/karas/suggest', { karaName: this.state.karaTitle, username: this.state.username })
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
					<h4>{i18n.t("modal.kara_suggestion_name")}</h4>
					<input required={true} onChange={(e) => this.setState({karaTitle: e.target.value})}/>
					<h4>{i18n.t("modal.username")}</h4>
					<input required={true} onChange={(e) => this.setState({username: e.target.value})}/>
					<div>
						<button type="button" onClick={this.props.onClose}>
							{icons.abort}
						</button>
						<button type="button" onClick={this.confirm}>
							{icons.confirm}
						</button>
					</div>
				</div>
			</div>
		)
	}
}

export default withTranslation('common')(Modal)
