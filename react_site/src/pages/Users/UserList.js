import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {Avatar, Button, Checkbox, Divider, Icon, Layout, Modal, Table} from 'antd';

import {loading, errorMessage, warnMessage} from '../../actions/navigation';
import {Link} from 'react-router-dom';

class UserList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			users: [],
			deleteModal: false,
			user: {}
		};
	}

	componentDidMount() {
		this.refresh();
	}

	refresh() {
		this.props.loading(true);
		axios.get('/api/users')
			.then(res => {
				this.props.loading(false);
				this.setState({users: res.data});
			})
			.catch(err => {
				this.props.loading(false);
				this.props.errorMessage(`${err.response.status}: ${err.response.statusText}. ${err.response.data}`);
			});
	}

	delete = (userId) => {
		axios.delete(`/api/users/${userId}`)
			.then(() => {
				this.props.warnMessage('User deleted.');
				this.setState({deleteModal: false, user: {}});
				this.refresh();
			})
			.catch(err => {
				this.props.errorMessage(`Error ${err.response.status} while deleting user: ${err.response.statusText}. ${err.response.data}`);
				this.setState({deleteModal: false, user: {}});
			});
	};

	render() {
		return (
			<Layout.Content style={{ padding: '25px 50px', textAlign: 'center' }}>
				<Table
					dataSource={this.state.users}
					columns={this.columns}
					rowKey='nickname'
				/>
				<Button type='primary' onClick={this.refresh.bind(this)}>Refresh</Button>
				<Modal
					title='Confirm user delete'
					visible={this.state.deleteModal}
					onOk={() => this.delete(this.state.user.user_id)}
					onCancel={() => this.setState({deleteModal: false, user: {}})}
					okText='yes'
					cancelText='no'
				>
					<p>Delete user <b>{this.state.user.login}</b></p>
					<p>Are you sure?</p>
				</Modal>
			</Layout.Content>
		);
	}

	columns = [{
		title: 'ID',
		dataIndex: 'user_id',
		key: 'user_id',
		render: user_id => <Link to={`/users/${user_id}`}>{user_id}</Link>,
		defaultSortOrder: 'ascend',
		sorter: (a, b) => a.user_id - b.user_id
	}, {
		title: 'Type',
		dataIndex: 'type',
		key: 'type',
		filters: [
			{ text: 'User', value: '1' },
			{ text: 'Guest', value: '2' },
		],
		render: text => text === 1 ? 'User' : 'Guest',
		filterMultiple: false,
		onFilter: (value, record) => `${record.type}` === value,
	}, {
		title: 'Avatar',
		dataIndex: 'avatar_file',
		key: 'avatar_file',		
		render: (text, record) => <Avatar shape="square" size="large" src={`/static/avatars/${record.avatar_file}`}/>,
		sorter: (a, b) => a.avatar_file.localeCompare(b.avatar_file)
	}, {
		title: 'Username',
		dataIndex: 'login',
		key: 'login',
		render: (text, record) => <Link to={`/users/${record.user_id}`}>{text}</Link>,
		sorter: (a, b) => a.login.localeCompare(b.login)
	}, {
		title: 'Nickname',
		dataIndex: 'nickname',
		key: 'nickname',
		render: (text, record) => <Link to={`/users/${record.user_id}`}>{text}</Link>,
		sorter: (a, b) => a.nickname.localeCompare(b.nickname)
	}, {
		title: 'Last seen on',
		dataIndex: 'last_login',
		key: 'last_login',
		render: (date) => (new Date(+date*1000)).toLocaleString('en'),
		sorter: (a,b) => a.last_login - b.last_login
	}, {
		title: 'Logged in?',
		dataIndex: 'flag_online',
		key: 'flag_online',
		filters: [
			{ text: 'Online', value: '1' },
			{ text: 'Offline', value: '0' },
		],
		render: text => <Checkbox disabled defaultChecked={text === 1} />,
		filterMultiple: false,
		onFilter: (value, record) => `${record.flag_online}` === value,
	}, {
		title: 'Admin?',
		dataIndex: 'flag_admin',
		key: 'flag_admin',
		filters: [
			{ text: 'Admin', value: '1' },
			{ text: 'Standard', value: '0' },
		],
		render: text => <Checkbox disabled defaultChecked={text === 1} />,
		filterMultiple: false,
		onFilter: (value, record) => `${record.flag_admin}` === value,
	}, {
		title: 'Action',
		key: 'action',
		render: (text, record) => (<span>
			<Link to={`/users/${record.user_id}`}><Icon type='edit'/></Link>
			<Divider type="vertical"/>
			<Button type='danger' icon='delete' onClick={
				() => this.setState({deleteModal: true, user: record})
			}/>
		</span>)
	}];
}

const mapStateToProps = (state) => ({
	loadingActive: state.navigation.loading
});

const mapDispatchToProps = (dispatch) => ({
	loading: (active) => dispatch(loading(active)),
	errorMessage: (message) => dispatch(errorMessage(message)),
	warnMessage: (message) => dispatch(warnMessage(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
