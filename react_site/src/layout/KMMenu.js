import React, {Component} from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {Link} from 'react-router-dom';
import {Menu, Icon, Button} from 'antd';

import {logout} from '../actions/auth';

class KMMenu extends Component {

	state = {
		current: '',
		connectOpenKeys: []
	};

	handleClick = (e) => {
		this.setState({
			current: e.key,
		});
	};

	connectMenu() {
		if (this.props.authenticated) {
			return (
				<div>
					<Menu
						mode='horizontal'
						theme='dark'
						style={{ lineHeight: '56px' }}
						onClick={() => this.setState({connectOpenKeys: []})}
						openKeys={this.state.connectOpenKeys}
					>
						<Menu.Item key='user'><span><Icon type='user' />{this.props.username}</span></Menu.Item>
						<Menu.Item key='logout'><Button icon='logout' onClick={this.props.logout}>Log Out</Button></Menu.Item>
					</Menu>
				</div>
			);
		} else {
			return (
				<div>
					<Menu
						mode='horizontal'
						theme='dark'
						style={{lineHeight: '56px'}}
						onClick={() => this.setState({connectOpenKeys: []})}
						openKeys={this.state.connectOpenKeys}
					>
						<Menu.Item key='login' style={{float: 'right'}}>
							<Button icon='login' onClick={() => this.props.push('/login')}>Log In</Button>
						</Menu.Item>
					</Menu>
				</div>
			);
		}
	}

	render() {
		return (
			<div style={{display: 'flex', justifyContent: 'space-between'}}>
				<div>
					<Menu
						mode='horizontal'
						theme='dark'
						style={{ lineHeight: '56px' }}
					>
						<Menu.Item key='home'><Link to='/home'>Home</Link></Menu.Item>
						<Menu.Item key='config'><Link to='/config'>Configuration</Link></Menu.Item>
						<Menu.SubMenu title='Karas'>
							<Menu.Item key='karamanage'><Link to='/karas'>List</Link></Menu.Item>
							<Menu.Item key='karaimport'><Link to='/karas/create'>New</Link></Menu.Item>
							<Menu.Item key='karahistory'><Link to='/karas/history'>History</Link></Menu.Item>
							<Menu.Item key='kararanking'><Link to='/karas/ranking'>Most requested</Link></Menu.Item>
							<Menu.Item key='karaviewcounts'><Link to='/karas/viewcounts'>Most played</Link></Menu.Item>
						</Menu.SubMenu>
						<Menu.SubMenu title='Series'>
							<Menu.Item key='seriesmanage'><Link to='/series'>List</Link></Menu.Item>
							<Menu.Item key='seriesnew'><Link to='/series/new'>New</Link></Menu.Item>
						</Menu.SubMenu>
						<Menu.Item key='db'><Link to='/db'>Database</Link></Menu.Item>
						<Menu.SubMenu title='Users'>
							<Menu.Item key='userlist'><Link to='/users'>User list</Link></Menu.Item>
							<Menu.Item key='newuser'><Link to='/users/create'>Create new user</Link></Menu.Item>
						</Menu.SubMenu>
					</Menu>
				</div>
				{this.connectMenu()}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	authenticated: state.auth.authenticated,
	username: state.auth.username,
});

const mapDispatchToProps = (dispatch) => ({
	logout: () => dispatch(logout()),
	push: (url) => dispatch(push(url))
});

export default connect(mapStateToProps, mapDispatchToProps)(KMMenu);
