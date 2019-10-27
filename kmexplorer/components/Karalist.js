import React from 'react'
import { i18n, withTranslation } from '../i18n'

import Karaitem from './Karaitem';
import Modal from '../components/Modal';

class Karalist extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			modal:false,
		}
	}
	
	displayModal = () => {
		this.setState({modal:true})
	}
	hideModal = () => {
		this.setState({modal:false})
	}

	render() {
		if(this.props.updating)
		{
			return (
				<div className="kmx-karas-list">
					<p className="info">{i18n.t('karalist.update_in_progress')}</p>
				</div>
			)
		}
		else if(this.props.data && this.props.data.length>0)
		{
			return (
				<div className="kmx-karas-list">
					{this.props.data.map((item,i) => {
						return <Karaitem key={i} data={item} tags={this.props.tags} filterTools={this.props.filterTools}/>
					})}
				</div>
			)
		}
		else
		{
			return (<>
				{this.state.modal ? <Modal onClose={() => this.hideModal()} />:null}
				<div className="kmx-karas-list">
					<p className="error">{i18n.t('karalist.no_data')}</p>
				</div>
				<div className="kara-suggestion" onClick={this.displayModal}>
        			{i18n.t("karalist.kara_suggestion")}
      			</div>
				</>
			)
		}
	}
}

export default withTranslation('common')(Karalist)