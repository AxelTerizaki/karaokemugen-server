import React from 'react'
import { i18n, withTranslation } from '../i18n'
import Karaitem from './Karaitem';
import Modal from '../components/Modal';
import axios from 'axios'
import RuntimeConfig from '../utils/RuntimeConfig';
const API_URL = RuntimeConfig.API_URL;

class Karalist extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			modal:false,
			gitlabEnabled: false
		}
		this.isGitlabEnabled();
	}
	
	displayModal = () => {
		this.setState({modal:true})
	}
	hideModal = () => {
		this.setState({modal:false})
	}

	isGitlabEnabled = async () => {
		var response = await axios.get(API_URL+'/api/settings');
		if(response.status===200) {
			this.setState({gitlabEnabled: response.data.config.Gitlab.Enabled});
		}
	}

	render() {
		if(this.props.updating) {
			return (
				<div className="kmx-karas-list">
					<p className="info">{i18n.t('karalist.update_in_progress')}</p>
				</div>
			)
		}
		else if(this.props.data && this.props.data.length>0) {
			return (
				<div className="kmx-karas-list">
					{this.props.data.map((item,i) => {
						return <Karaitem key={i} data={item} tags={this.props.tags} filterTools={this.props.filterTools}/>
					})}
				</div>
			)
		} else {
			return (<>
				{this.state.modal ? <Modal onClose={() => this.hideModal()} />:null}
				<div className="kmx-karas-list">
					<p className="error">{i18n.t('karalist.no_data')}</p>
				</div>
				{this.state.gitlabEnabled ?
					<div className="kara-suggestion" onClick={this.displayModal}>
						{i18n.t("karalist.kara_suggestion")}
					</div> : null
				}
				</>
			)
		}
	}
}

export default withTranslation('common')(Karalist)