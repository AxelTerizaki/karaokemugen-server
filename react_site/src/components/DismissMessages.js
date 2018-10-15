import React, {Component} from 'react';

import {connect} from 'react-redux';

import {dismissAll} from '../actions/navigation';
import Loading from './Loading';

export default function(ComposedComponentPromise) {

	class DismissMessages extends Component {

		state = {};

		componentWillMount() {
			this.props.dismissAll();
			ComposedComponentPromise.then(c => this.setState({ c: c}));
		}

		render() {
			if (!this.state.c) {
				return <Loading/>;
			} else {
				return this.state.c.default ? <this.state.c.default {...this.props} />
					: <this.state.c {...this.props} />;
			}
		}
	}

	const mapDispatchToProps = (dispatch) => ({
		dismissAll: () => dispatch(dismissAll())
	});

	return connect(null, mapDispatchToProps)(DismissMessages);
}