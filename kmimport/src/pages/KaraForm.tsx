import React, { Component } from "react";
import {
	Button,
	Form,
	Icon,
	Input,
	InputNumber,
	message,
	Select,
	Tooltip,
	Upload
} from "antd";
import EditableTagGroup from "./Components/EditableTagGroup";
import axios from "axios/index";
import { getTagInLocale } from "../utils/kara";
import i18next from 'i18next';

interface KaraFormProps {
	kara: any;
	form: any;
	save: any;
}

interface Tag {
	tid: string;
	i18n: any[];
	short: string;
	name: string;
	types: any[];
	misc: any[]
}

interface KaraFormState {
	serieSingersRequired: Boolean;
	subfile: any[];
	mediafile: any[];
	singers: Tag[];
	authors: Tag[];
	misc: Tag[];
	serie_orig: any[];
	creators: Tag[];
	songwriters: Tag[];
	groups: Tag[];
	songtypes: Tag;
	langs: Tag[];
	families?: Tag[];
	genres?: Tag[];
	platforms?: Tag[];
	origins?: Tag[];
	created_at?: Date;
	modified_at?: Date;
	songtypesValue: Tag[];
}

class KaraForm extends Component<KaraFormProps, KaraFormState> {
	constructor(props) {
		super(props);
		const kara = this.props.kara;
		this.getSongtypes();
		this.state = {
			serieSingersRequired: false,
			subfile: kara.subfile
				? [
					{
						uid: -1,
						name: kara.subfile,
						status: "done"
					}
				]
				: null,
			mediafile: kara.mediafile
				? [
					{
						uid: -1,
						name: kara.mediafile,
						status: "done"
					}
				]
				: null,
			singers: this.getTagArray(kara.singers),
			authors: this.getTagArray(kara.authors),
			misc: this.getTagArray(kara.misc),
			serie_orig: kara.serie_orig ? [kara.serie_orig] : [],
			creators: this.getTagArray(kara.creators),
			songwriters: this.getTagArray(kara.songwriters),
			groups: this.getTagArray(kara.groups),
			songtypes: kara.songtypes ? kara.songtypes[0] : [],
			langs: this.getTagArray(kara.langs),
			families: this.getTagArray(kara.families),
			platforms: this.getTagArray(kara.platforms),
			genres: this.getTagArray(kara.genres),
			origins: this.getTagArray(kara.origins),
			created_at: kara.created_at ? kara.created_at : new Date(),
			modified_at: kara.modified_at ? kara.modified_at : new Date(),
			songtypesValue: null
		};
	}

	getTagArray(value) {
		if (value) {
			return value.map(element => {
				return [element.tid, getTagInLocale(element), element.name]
			});
		} else {
			return [];
		}
	}

	getTagObject(value) {
		if (value) {
			return value.map(element => {
				if (element.length === 3) {
					return { tid: element[0], name: element[2] };
				} else if (element.length === 2) {
					return { tid: element[0], name: element[1] };
				} else {
					return null;
				}
			});
		}
		else {
			return [];
		}
	}

	getSongtypes = async () => {
		const res = await axios.get("/api/karas/tags/3");
		this.setState({ songtypesValue: this.getTagArray(res.data.content) });
	};

	componentDidMount() {
		this.props.form.validateFields();
		this.props.form.validateFields(['series'], { force: true });
		this.props.form.validateFields(['singers'], { force: true });
	}

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			var kara = values;
			kara.singers = this.getTagObject(kara.singers);
			kara.authors = this.getTagObject(kara.authors);
			kara.misc = this.getTagObject(kara.misc);
			kara.creators = this.getTagObject(kara.creators);
			kara.songwriters = this.getTagObject(kara.songwriters);
			kara.groups = this.getTagObject(kara.groups);
			kara.langs = this.getTagObject(kara.langs);
			kara.families = this.getTagObject(kara.families);
			kara.platforms = this.getTagObject(kara.platforms);
			kara.genres = this.getTagObject(kara.genres);
			kara.origins = this.getTagObject(kara.origins);
			kara.songtypes = this.getTagObject(this.state.songtypesValue).filter(value => values.songtypes === value.tid);
			if (!err) this.props.save(kara);
		});
	};

	isMediaFile = filename => {
		return new RegExp("^.+\\.(avi|mkv|mp4|webm|mov|wmv|mpg|ogg|m4a|mp3)$").test(
			filename
		);
	};

	onMediaUploadChange = info => {
		let fileList = info.fileList;
		fileList = fileList.slice(-1);
		this.setState({ mediafile: fileList });
		if (info.file.status === "uploading") {
			this.props.form.setFieldsValue({ mediafile: null, mediafile_orig: null });
		} else if (info.file.status === "done") {
			if (this.isMediaFile(info.file.name)) {
				this.props.form.setFieldsValue({
					mediafile: info.file.response.filename,
					mediafile_orig: info.file.response.originalname
				});
				message.success(i18next.t('KARA.ADD_FILE_SUCCESS', { name: info.file.name }));
			} else {
				this.props.form.setFieldsValue({ mediafile: null });
				message.error(i18next.t('KARA.ADD_FILE_MEDIA_ERROR', { name: info.file.name }));
				info.file.status = "error";
				this.setState({ mediafile: [] });
			}
		} else if (info.file.status === "error") {
			this.props.form.setFieldsValue({ mediafile: null, mediafile_orig: null });
			this.setState({ mediafile: [] });
		}
	};

	onSubUploadChange = info => {
		let fileList = info.fileList;
		fileList = fileList.slice(-1);
		this.setState({ subfile: fileList });
		if (info.file.status === "uploading") {
			this.props.form.setFieldsValue({ subfile: null, subfile_orig: null });
		} else if (info.file.status === "done") {
			if (info.file.name.endsWith(".ass") || info.file.name.endsWith(".txt") ||info.file.name.endsWith(".kfn") || info.file.name.endsWith(".kar")) {
				this.props.form.setFieldsValue({
					subfile: info.file.response.filename,
					subfile_orig: info.file.response.originalname
				});
				message.success(i18next.t('KARA.ADD_FILE_SUCCESS', { name: info.file.name }));
			} else {
				this.props.form.setFieldsValue({ subfile: null, subfile_orig: null });
				message.error(i18next.t('KARA.ADD_FILE_LYRICS_ERROR', { name: info.file.name }));
				info.file.status = "error";
				this.setState({ subfile: [] });
			}
		} else if (info.file.status === "error") {
			this.props.form.setFieldsValue({ subfile: null });
			this.setState({ subfile: [] });
		}
	};

	onChangeSingersSeries = (tags, type) => {
		this.setState({serieSingersRequired: (!tags || tags.length === 0) &&  this.props.form.getFieldValue(type).length === 0}, () => {
			this.props.form.validateFields(['series'], { force: true });
			this.props.form.validateFields(['singers'], { force: true });
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { TextArea } = Input;

		return (
			<Form onSubmit={this.handleSubmit} className="kara-form">
				<Form.Item
					hasFeedback
					label={
						<span>{i18next.t('KARA.MEDIA_FILE')}&nbsp;
							<Tooltip title={i18next.t('KARA.MEDIA_FILE_TOOLTIP')}>
								<Icon type="question-circle-o" />
							</Tooltip>
						</span>
					}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 6, offset: 0 }}
				>
					<Upload
						action="/api/karas/importfile"
						accept="video/*,audio/*"
						multiple={false}
						onChange={this.onMediaUploadChange}
						fileList={this.state.mediafile}
					>
						<Button>
							<Icon type="upload" />{i18next.t('KARA.MEDIA_FILE')}
						</Button>
					</Upload>
				</Form.Item>
				<Form.Item
					label={
						<span>{i18next.t('KARA.LYRICS_FILE')}&nbsp;
							<Tooltip title={i18next.t('KARA.LYRICS_FILE_TOOLTIP')}>
								<Icon type="question-circle-o" />
							</Tooltip>
						</span>
					}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 6, offset: 0 }}
				>
					<Upload
						action="/api/karas/importfile"
						multiple={false}
						onChange={this.onSubUploadChange}
						fileList={this.state.subfile}
					>
						<Button>
							<Icon type="upload" />{i18next.t('KARA.LYRICS_FILE')}
						</Button>
					</Upload>
				</Form.Item>
				<Form.Item
					hasFeedback
					label={
						<span>{i18next.t('KARA.TITLE')}&nbsp;
							<Tooltip title={i18next.t('KARA.TITLE_TOOLTIP')}>
								<Icon type="question-circle-o" />
							</Tooltip>
						</span>
					}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 8, offset: 0 }}
				>
					{getFieldDecorator("title", {
						initialValue: this.props.kara.title,
						rules: [{
							required: true,
							message: i18next.t('KARA.TITLE_REQUIRED')
						}],
					})(<Input
						placeholder={i18next.t('KARA.TITLE')}
					/>)}
				</Form.Item>

				<Form.Item
					hasFeedback
					label={
						<span>{i18next.t('KARA.SERIES')}&nbsp;
							<Tooltip title={i18next.t('KARA.SERIES_TOOLTIP')}>
								<Icon type="question-circle-o" />
							</Tooltip>
						</span>
					}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 14, offset: 0 }}
				>
					{getFieldDecorator("series", {
						initialValue: this.state.serie_orig,
						rules: [{
							required: this.state.serieSingersRequired,
							message: i18next.t('KARA.SERIES_SINGERS_REQUIRED')
						}]
					})(
						<EditableTagGroup
							search={"serie"}
							onChange={tags => {
								this.props.form.setFieldsValue({ serie_orig: tags });
								this.onChangeSingersSeries(tags, "singers");
							}
							}
						/>
					)}
				</Form.Item>
				{this.state.songtypesValue ?
					<Form.Item
						label={i18next.t('KARA.TYPE')}
						labelCol={{ span: 3 }}
						wrapperCol={{ span: 3, offset: 0 }}
					>

						{getFieldDecorator("songtypes", {
							rules: [{
								required: true,
								message: i18next.t('KARA.TYPE_REQUIRED')
							}],
							initialValue: this.state.songtypes.tid
						})(

							<Select placeholder={i18next.t('KARA.TYPE')}>
								{this.state.songtypesValue.map(type => {
									return <Select.Option key={type[0]} value={type[0]}>{type[1]}</Select.Option>
								})
								}
							</Select>
						)}
					</Form.Item> : null
				}

				<Form.Item hasFeedback
					label={(
						<span>{i18next.t('KARA.ORDER')}&nbsp;
							<Tooltip title={i18next.t('KARA.ORDER_TOOLTIP')}>
								<Icon type="question-circle-o" />
							</Tooltip>
						</span>
					)}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 1, offset: 0 }}
				>
					{getFieldDecorator('order', {
						initialValue: this.props.kara.songorder
					})(<InputNumber
						min={0}
						style={{ width: '100%' }}
					/>)}
				</Form.Item>
				<Form.Item hasFeedback
					label={i18next.t('KARA.LANGUAGES')}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 6, offset: 0 }}
				>
					{getFieldDecorator('langs', {
						rules: [{
							required: true,
							message: i18next.t('KARA.LANGUAGES_REQUIRED')
						}],
						initialValue: this.state.langs
					})(<EditableTagGroup
						tagType={5}
						search={'tag'}
						onChange={(tags) => this.props.form.setFieldsValue({ langs: tags })}
					/>)}
				</Form.Item>
				<Form.Item hasFeedback
					label={(
						<span>{i18next.t('KARA.YEAR')}&nbsp;
							<Tooltip title={i18next.t('KARA.YEAR_TOOLTIP')}>
								<Icon type="question-circle-o" />
							</Tooltip>
						</span>
					)}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 2, offset: 0 }}
				>
					{getFieldDecorator('year', {
						initialValue: this.props.kara.year || 2010,
						rules: [{ required: true }]
					})(<InputNumber
						min={0}
						placeholder='Year'
						style={{ width: '100%' }}
					/>)}
				</Form.Item>
				<Form.Item hasFeedback
					label={i18next.t('KARA.SINGERS')}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 6, offset: 0 }}
				>
					{getFieldDecorator('singers', {
						initialValue: this.state.singers,
						rules: [{
							required: this.state.serieSingersRequired,
							message: i18next.t('KARA.SERIES_SINGERS_REQUIRED')
						}]
					})(<EditableTagGroup
						tagType={2}
						search={'tag'}
						onChange={(tags) => {
							this.props.form.setFieldsValue({ singer: tags });
							this.onChangeSingersSeries(tags, "series");
						}
						}
					/>)}
				</Form.Item>
				<Form.Item
					label={(
						<span>{i18next.t('KARA.SONGWRITERS')}&nbsp;
							<Tooltip title={i18next.t('KARA.SONGWRITERS_TOOLTIP')}>
								<Icon type="question-circle-o" />
							</Tooltip>
						</span>
					)}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 6, offset: 0 }}
				>
					{getFieldDecorator('songwriters', {
						initialValue: this.state.songwriters
					})(<EditableTagGroup
						tagType={8}
						search={'tag'}
						onChange={(tags) => this.props.form.setFieldsValue({ songwriters: tags })}
					/>)}
				</Form.Item>
				<Form.Item
					label={(
						<span>{i18next.t('KARA.CREATORS')}&nbsp;
							<Tooltip title={i18next.t('KARA.CREATORS_TOOLTIP')}>
								<Icon type="question-circle-o" />
							</Tooltip>
						</span>
					)}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 6, offset: 0 }}
				>
					{getFieldDecorator('creators', {
						initialValue: this.state.creators
					})(<EditableTagGroup
						tagType={4}
						search={'tag'}
						onChange={(tags) => this.props.form.setFieldsValue({ creators: tags })}
					/>)}
				</Form.Item>
				<Form.Item hasFeedback
					label={(
						<span>{i18next.t('KARA.KARA_AUTHORS')}&nbsp;
							<Tooltip title={i18next.t('KARA.KARA_AUTHORS_TOOLTIP')}>
								<Icon type="question-circle-o" />
							</Tooltip>
						</span>
					)}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 6, offset: 0 }}
				>
					{getFieldDecorator('authors', {
						initialValue: this.state.authors,
						rules: [{
							required: true,
							message: i18next.t('KARA.KARA_AUTHORS_REQUIRED')
						}]
					})(<EditableTagGroup
						tagType={6}
						search={'tag'}
						onChange={(tags) => this.props.form.setFieldsValue({ author: tags })}
					/>)}
				</Form.Item>
				<Form.Item
					label={i18next.t('KARA.FAMILIES')}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 10, offset: 0 }}
				>
					{getFieldDecorator('families', {
						initialValue: this.state.families
					})(<EditableTagGroup
						tagType={10}
						checkboxes={true}
						search={'tag'}
						onChange={(tags) => this.props.form.setFieldsValue({ families: tags })}
					/>)}
				</Form.Item>
				<Form.Item
					label={i18next.t('KARA.PLATFORMS')}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 10, offset: 0 }}
				>
					{getFieldDecorator('platforms', {
						initialValue: this.state.platforms
					})(<EditableTagGroup
						tagType={13}
						checkboxes={true}
						search={'tag'}
						onChange={(tags) => this.props.form.setFieldsValue({ platforms: tags })}
					/>)}
				</Form.Item>
				<Form.Item
					label={i18next.t('KARA.GENRES')}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 10, offset: 0 }}
				>
					{getFieldDecorator('genres', {
						initialValue: this.state.genres
					})(<EditableTagGroup
						tagType={12}
						checkboxes={true}
						search={'tag'}
						onChange={(tags) => this.props.form.setFieldsValue({ genres: tags })}
					/>)}
				</Form.Item>
				<Form.Item
					label={i18next.t('KARA.ORIGINS')}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 10, offset: 0 }}
				>
					{getFieldDecorator('origins', {
						initialValue: this.state.origins
					})(<EditableTagGroup
						tagType={11}
						checkboxes={true}
						search={'tag'}
						onChange={(tags) => this.props.form.setFieldsValue({ origins: tags })}
					/>)}
				</Form.Item>
				<Form.Item
					label={i18next.t('KARA.MISC')}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 10, offset: 0 }}
				>
					{getFieldDecorator('misc', {
						initialValue: this.state.misc
					})(<EditableTagGroup
						tagType={7}
						checkboxes={true}
						search={'tag'}
						onChange={(tags) => this.props.form.setFieldsValue({ misc: tags })}
					/>)}
				</Form.Item>
				<Form.Item
					label={(
						<span>{i18next.t('KARA.GROUPS')}&nbsp;
							<Tooltip title={i18next.t('KARA.GROUPS_TOOLTIP')}>
								<Icon type="question-circle-o" />
							</Tooltip>
						</span>
					)}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 6, offset: 0 }}
				>
					{getFieldDecorator('groups', {
						initialValue: this.state.groups
					})(<EditableTagGroup
						tagType={9}
						search={'tag'}
						onChange={(tags) => this.props.form.setFieldsValue({ groups: tags })}
					/>)}
				</Form.Item>
				<Form.Item
					label={i18next.t('KARA.CREATED_AT')}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 8, offset: 0 }}
				>
					{getFieldDecorator('created_at', {
						initialValue: this.props.kara.created_at
					})(<Input type="hidden" />)}
					<label className="description">{this.props.kara.created_at ? new Date(this.props.kara.created_at).toLocaleString() : null}</label>
				</Form.Item>
				<Form.Item
					label={i18next.t('KARA.MODIFIED_AT')}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 8, offset: 0 }}
				>
					{getFieldDecorator('modified_at', {
						initialValue: this.props.kara.modified_at
					})(<Input type="hidden" />)}
					<label className="description">{this.props.kara.modified_at ? new Date(this.props.kara.modified_at).toLocaleString() : null}</label>
				</Form.Item>
				<Form.Item
					hasFeedback
					label={
						<span>{i18next.t('KARA.COMMENT')}&nbsp;
							<Tooltip title={i18next.t('KARA.COMMENT_TOOLTIP')}>
								<Icon type="question-circle-o" />
							</Tooltip>
						</span>
					}
					labelCol={{ span: 3 }}
					wrapperCol={{ span: 8, offset: 0 }}
				>
					{getFieldDecorator("comment", {
						initialValue: null,
						rules: [{
							required: false
						}],
					})(<>
						{this.props.kara.kid ? <label className="description">{i18next.t('KARA.COMMENT_EDIT')}</label> : null}
						<TextArea onChange={(e) => this.props.form.setFieldsValue({ comment: e.target.value })}/>
					</>)}
				</Form.Item>
				<Form.Item
					wrapperCol={{ span: 8, offset: 1 }}
				>
					<Button type='primary' htmlType='submit' className='login-form-button'>{i18next.t('SUBMIT')}</Button>
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('kid', {
						initialValue: this.props.kara.kid
					})(<Input type="hidden" />)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('karafile', {
						initialValue: this.props.kara.karafile
					})(<Input type="hidden" />)}
				</Form.Item>

				<Form.Item>
					{getFieldDecorator('mediafile', {
						initialValue: this.props.kara.mediafile
					})(<Input type="hidden" />)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('mediafile_orig', {
						initialValue: null
					})(<Input type="hidden" />)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('subfile_orig', {
						initialValue: null
					})(<Input type="hidden" />)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('subfile', {
						initialValue: this.props.kara.subfile
					})(<Input type="hidden" />)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('repository', {
						initialValue: this.props.kara.repository
					})(<Input type="hidden" />)}
				</Form.Item>
			</Form>
		);
	}
}

const cmp: any = Form.create()(KaraForm);
export default cmp;
