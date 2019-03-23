import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash.deburr';
import {Checkbox, Row, Col, Button, Form, AutoComplete, Icon, Tag, Tooltip} from 'antd';
import axios from 'axios/index';
import langs from 'langs';

export default class EditableTagGroup extends React.Component {

	constructor(props) {
		super(props);
		if (this.props.checkboxes) this.search();
	}

	state = {
		value: this.props.value || [],
		inputVisible: false,
		DS: []
	};

	handleClose = (removedTag) => {
		const tags = this.state.value.filter(tag => tag !== removedTag);
		this.setState({ value: tags });
		this.props.onChange && this.props.onChange(tags);
	};

	showInput = () => {
		this.setState({ inputVisible: true }, () => this.input.focus());
	};

	handleInputConfirm = (val) => {
		let tags = this.state.value;
		if (val && tags.indexOf(val) === -1) {
			tags = [...tags, val];
		}
		this.setState({
			value: tags,
			inputVisible: false
		});
		this.props.onChange && this.props.onChange(tags);
	};

	getTags = async (filter, type) => {
		let API_URL = 'https://localhost:1350';
		if (filter === '') {
			return ({data: []});
		}
		return axios.get(API_URL+'/api/karas/tags/'+type, {
			params: {
				filter: filter
			}
		});
	};

	getSeries = async (filter) => {
		let API_URL = 'https://localhost:1350';
		if (filter === '') {
			return ({data: []});
		}
		return axios.get(API_URL+'/api/karas/series', {
			params: {
				filter: filter
			}
		});
	};

	search = (val) => {
		if (this.props.search === 'tag') this.searchTags(val);
		if (this.props.search === 'serie') this.searchSeries(val);
		if (this.props.search === 'lang') this.searchLangs(val);
	};

	searchLangs = (val) => {
		let languages = [];
		langs.all().forEach(lang => languages.push({value: lang['2B'], text: lang.name}));
		languages.push({value: 'mul', text: 'Multi-languages'});
		languages.push({value: 'und', text: 'Undefined Language'});
		languages.push({value: 'zxx', text: 'No Linguistic Content'});
		this.setState({ DS: this.sortByProp(languages, 'text') || [] });
	}

	searchSeries = (val) => {
		this.getSeries(val).then(series => {
			this.setState({ DS: series.data.content.map(serie => serie.name) || [] });
		});
	};

	searchTags = (val) => {
		this.getTags(val, this.props.tagType).then(tags => {
			let result = tags.data.content.map(tag => {
				// Lazyness just scored a 12 with 2d6 on me
				// We'll only display the english version of the tag name for now.
				// Maybe when a hero will come and fix issue #263 we'll have true i18n and evil will be vanquished for the next 1000 years.
				return { value: tag.name, text: tag.i18n.en ? tag.i18n.en : tag.name };
			}) || [];
			result = this.sortByProp(result, 'text');
			this.setState({ DS: result });
		});
	};

	onCheck = (val) => {
		this.props.onChange && this.props.onChange(val);
	};

	sortByProp = (array, val) => {
		return array.sort((a,b) => {
			return (a[val] > b[val]) ? 1 : (a[val] < b[val]) ? -1 : 0;
		});
	}

	render() {
		const { value, inputVisible } = this.state;
		if (this.props.checkboxes) {
			return (
				<div>

					<Checkbox.Group defaultValue={this.state.value} style={{ width: '100%' }} onChange={this.onCheck}>
						<Row>
							{
								this.state.DS.map((tag) => {
									return (
										<Col align='left' span={8}>
											<Checkbox value={tag.value}>{tag.text}
											</Checkbox>
										</Col>
									);
								})
							}
						</Row>
					</Checkbox.Group>
				</div>
			);
		} else {

			return (
				<div>
					{
						value.map((tag) => {
							if (!tag) tag = '';
							const isLongTag = tag.length > 20;
							const tagElem = (
								<Tag key={tag} closable='true' afterClose={() => this.handleClose(tag)}>
									{isLongTag ? `${tag.slice(0, 20)}...` : tag}
								</Tag>
							);
							return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
						})}
					{inputVisible && (
						<Form.Item
							wrapperCol={{ span: 10, offset: 0 }}
						>
							<AutoComplete
								ref={input => this.input = input}
								dataSource={this.state.DS}
								onSearch={ this.search }
								onChange={ val => this.currentVal = val }
								filterOption={(inputValue, option) => deburr(option.props.children.toUpperCase()).indexOf(deburr(inputValue).toUpperCase()) !== -1}
							>
							</AutoComplete>
							<Button type='primary' onClick={() => this.handleInputConfirm(this.currentVal)}
								className='login-form-button'>
						Add...
							</Button>
						</Form.Item>
					)}
					{!inputVisible && (
						<Tag
							onClick={this.showInput}
							style={{ background: '#fff', borderStyle: 'dashed' }}
						>
							<Icon type="plus" /> Add
						</Tag>
					)}
				</div>
			);
		}

	}
}

EditableTagGroup.propTypes = {
	tagType: PropTypes.number,
	search: PropTypes.string.isRequired,
	onChange: PropTypes.func,
	value: PropTypes.array
};