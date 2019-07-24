import React from 'react';
import deburr from 'lodash.deburr';
import {AutoComplete, Button, Checkbox, Col, Form, Icon, Input, Row, Tag, Tooltip} from 'antd';
import axios from 'axios/index';
import { getTagInLocale } from "../../utils/kara";
interface EditableTagGroupProps {
	search: 'tag' | 'serie' | 'aliases',
	onChange: any,
	checkboxes?: boolean,
	tagType?: number,
	value?: any[],
	translation: any
}

interface EditableTagGroupState {
	DS: any,
	value: any[],
	inputVisible: boolean,
}

export default class EditableTagGroup extends React.Component<EditableTagGroupProps, EditableTagGroupState> {

	input: any;
	currentVal: any;

	constructor(props) {
		super(props);
		if (this.props.checkboxes) this.search();
	}

	state = {
		value: this.props.value || [],
		inputVisible: false,
		DS: []
	};

	showInput = () => {
		this.setState({ inputVisible: true }, () => this.input.focus());
	};

	
	handleInputConfirmSerie = (val) => {
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

	handleCloseSerie = (removedTag) => {
		const tags = this.state.value.filter(tag => tag !== removedTag);
		this.setState({ value: tags });
		this.props.onChange && this.props.onChange(tags);
	};

	handleClose = (removedTag) => {
		const tags = this.state.value.filter(tag => tag[0] !== removedTag[0]);
		this.setState({ value: tags });
		this.props.onChange && this.props.onChange(tags);
	};

	handleInputConfirm = (val) => {
		let tags = this.state.value;
		var tag = this.state.DS.filter(tag => val === tag.value);
		if (tags.filter(tag => val === tag.tid).length === 0) {
			if (tag.length > 0) {
				tags.push([tag[0].value, tag[0].text]);
			} else {
				tags.push([null, val]);
			}
		}
		this.setState({
			value: tags,
			inputVisible: false
		});
		this.props.onChange && this.props.onChange(tags);
	};

	getTags = async (type) => {
		return axios.get('/api/karas/tags/'+type);
	};

	getSeries = async (filter) => {
		if (filter === '') {
			return ({data: []});
		}
		return axios.get('/api/karas/series', {
			params: {
				filter: filter
			}
		});
	};

	search = (val?: any) => {
		if (this.props.search === 'tag') this.searchTags(val);
		if (this.props.search === 'serie') this.searchSeries(val);
	};

	searchSeries = (val) => {
		this.getSeries(val).then(series => {
			this.setState({ DS: series.data.content.map(serie => serie.name) || [] });
		});
	};

	searchTags = (val?: any) => {
		this.getTags(this.props.tagType).then(tags => {
			let result = tags.data.content.map(tag => {
				return { value: tag.tid, text: getTagInLocale(tag) };
			}) || [];
			result = this.sortByProp(result, 'text');
			this.setState({ DS: result });
		});
	};

	onCheck = (val) => {
		var tags = []
		val.forEach(element => {
			var tag = this.state.DS.filter(tag => element === tag.value);
			tags.push([tag[0].value, tag[0].text]);
		});
		this.props.onChange && this.props.onChange(tags);
	};

	sortByProp = (array, val) => {
		return array.sort((a,b) => {
			return (a[val] > b[val]) ? 1 : (a[val] < b[val]) ? -1 : 0;
		});
	}

	onKeyEnter = (e) => {
		if (e.keyCode === 13)
			this.handleInputConfirm(this.currentVal)
	}

	onKeyEnterSerie = (e) => {
		if (e.keyCode === 13)
			this.handleInputConfirmSerie(this.currentVal)
	}

	render() {
		const { value, inputVisible } = this.state;
		const t = this.props.translation;
		if (this.props.checkboxes) {
			return (
				<div>

					<Checkbox.Group defaultValue={this.state.value[0]} style={{ width: '100%' }} onChange={this.onCheck}>
						<Row>
							{
								this.state.DS.map((tag) => {
									return (
										<Col span={8} key={tag.value}>
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
		} else if (this.props.search === 'serie') {
			return (
				<div>
					{
						value.map((tag) => {
							if (!tag) tag = '';
							const isLongTag = tag.length > 20;
							const tagElem = (
								<Tag key={tag} closable={true} onClose={() => this.handleCloseSerie(tag)}>
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
								filterOption={(inputValue, option) => {
									const s: any = option.props.children;
									return deburr(s.toUpperCase()).indexOf(deburr(inputValue).toUpperCase()) !== -1;
								}}
							>
							<Input onKeyDown={this.onKeyEnterSerie} />
							</AutoComplete>
							<Button type='primary' onClick={() => this.handleInputConfirmSerie(this.currentVal)}
								className='login-form-button'>
								{t('ADD')}
							</Button>
						</Form.Item>
					)}
					{!inputVisible && (
						<Tag
							onClick={this.showInput}
							style={{ background: '#fff', borderStyle: 'dashed' }}
						>
							<Icon type="plus" />{t('ADD')}
						</Tag>
					)}
				</div>
			);
		} else {
			return (
				<div>
					{
						value.map((tag) => {
							if (!tag) tag = '';
							const isLongTag = tag[1].length > 20;
							const tagElem = (
								<Tag key={tag} closable={true} onClose={() => this.handleClose(tag)}>
									{isLongTag ? `${tag[1].slice(0, 20)}...` : tag[1]}
								</Tag>
							);
							return isLongTag ? <Tooltip title={tag[1]} key={tag}>{tagElem}</Tooltip> : tagElem;
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
								filterOption={(inputValue, option) => {
									const s: any = option.props.children;
									return deburr(s.toUpperCase()).indexOf(deburr(inputValue).toUpperCase()) !== -1;
								}}
							>
							<Input onKeyDown={this.onKeyEnter} />
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
