import React, {Component} from 'react';
import {Layout} from 'antd';
import KaraForm from './KaraForm';
import axios from 'axios/index';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {errorMessage, infoMessage, loading} from '../../actions/navigation';
import timestamp from 'unix-timestamp';

timestamp.round = true;

const newKara = {
	kid: null,
	songorder: null,
	type: 'OP',
	serie: null,
	title: null,
	lang: 'jpn',
	singer: null,
	songwriter: null,
	year: null,
	creator: null,
	author: null,
	misc: null,
	groups: null,
	dateadded: timestamp.now()
};

class KaraEdit extends Component {

	state = {
		kara: null,
		save: () => {}
	};

	componentDidMount() {
		this.loadKara();
	}

	saveNew = (kara) => {
		axios.post('/api/karas', kara)
			.then(() => {
				this.props.infoMessage('Kara successfully created');
				this.props.push('/karas');
			})
			.catch(err => {
				this.props.errorMessage(`${err.response.status}: ${err.response.statusText}. ${err.response.data}`);
			});
	};

	saveUpdate = (kara) => {
		axios.put(`/api/karas/${kara.kara_id}`, kara)
			.then(() => {
				this.props.infoMessage('Kara successfully edited');
				this.props.push('/karas');
			})
			.catch(err => {
				this.props.errorMessage(`${err.response.status}: ${err.response.statusText}. ${err.response.data}`);
			});
	};

	loadKara = () => {
		this.props.loading(true);
		if (this.props.match && this.props.match.params.kara_id) {
			axios.get(`/api/karas/${this.props.match.params.kara_id}`)
				.then(res => {
					const karaData = {
						author: res.data[0].author,
						creator: res.data[0].creator,
						kid: res.data[0].kid,
						lang: res.data[0].language,
						mediafile_old: res.data[0].mediafile,
						mediafile: res.data[0].mediafile,
						tags: res.data[0].misc,
						series: res.data[0].serie_orig,
						singer: res.data[0].singer,
						groups: res.data[0].groups,
						songwriter: res.data[0].songwriter,
						subfile: res.data[0].subfile,
						subfile_old: res.data[0].subfile,
						karafile: res.data[0].karafile,
						title: res.data[0].title,
						year: res.data[0].year,
						order: res.data[0].songorder,
						type: res.data[0].songtype,
						dateadded: res.data[0].created_at,
						datemodif: res.data[0].modified_at,
						kara_id: this.props.match.params.kara_id
					};
					this.setState({kara: karaData, save: this.saveUpdate});
					this.props.loading(false);
				})
				.catch(err => {
					this.props.errorMessage(`${err.response.status}: ${err.response.statusText}. ${err.response.data}`);
					this.props.loading(false);
				});
		} else {
			this.setState({kara: {...newKara}, save: this.saveNew});
			this.props.loading(false);
		}
	};


	render() {
		return (
			<Layout.Content style={{padding: '25px 50px', textAlign: 'center'}}>
				{this.state.kara && (<KaraForm kara={this.state.kara} save={this.state.save} />)}
			</Layout.Content>
		);
	}
}

const mapStateToProps = (state) => ({
	loadingActive: state.navigation.loading
});

const mapDispatchToProps = (dispatch) => ({
	loading: (active) => dispatch(loading(active)),
	infoMessage: (message) => dispatch(infoMessage(message)),
	errorMessage: (message) => dispatch(errorMessage(message)),
	push: (url) => dispatch(push(url))
});

export default connect(mapStateToProps, mapDispatchToProps)(KaraEdit);