import React from 'react'
import { i18n, withTranslation } from '../i18n'
import Head from 'next/head'
import Pagination from '../components/Pagination';
import DedicatedTagList from '../components/DedicatedTagList';
import tagsMap from '../components/tagsMap.js';
import FilterTools from '../utils/filterTools';
import isoLanguages from '../components/isoLanguages';
const filterTools = new FilterTools();


class Page extends React.Component {
	static async getInitialProps({ req, query, res }) {

		let namespacesRequired = ['common', 'tag'];

		return { namespacesRequired };
	}

	constructor (props) {
		super(props)
		this.state = {
			searchKeywords:"",
			orderBy:"quantity",
		}
		filterTools.setParams(props.filterParams);
	}

	componentWillUpdate(nextProps, nextState) {
		filterTools.setParams(nextProps.filterParams);
	}

	updateKeyword(event) {
	    // local state update of the search input field
	    filterTools.reset().setKeywords(event.target.value).save();
	    this.setState({
	    	searchKeywords: event.target.value,
	    })
	}

	updateOrder(mode) {
	    this.setState({
	    	orderBy: mode,
	    })
	}

	render() {
		let kmax = 1;
		let pageSize = 100;
		let page = filterTools.getPage()
		let keywords = this.state.searchKeywords;

		let tagList = [];
		for (let id in this.props.tags) {
			let tag = this.props.tags[id];
			if(tag.types.includes(tagsMap.songwriter.id))
			{
				kmax = Math.max(kmax,tag.karacount[tagsMap.songwriter.id]);
				if(keywords.length==0 || filterTools.keywordSearch(tag.name,keywords))
					tagList.push(tag);
			}
		}
		let total = tagList.length

		tagList = tagList.map(function(tag){
			return {
				key: tag.tid,
				name : tag.i18n[isoLanguages("iso3",i18n.language)] || (tag.i18n['eng'] || tag.name),
				karacount : tag.karacount[tagsMap.songwriter.id],
				link : filterTools.clear().addTag('songwriter',tag.tid,tag.slug).getQuery().url,
				height : 100 * tag.karacount[tagsMap.songwriter.id] / kmax
			};
		})

		return (
			<div>
				<Head>
					<title key="title">{i18n.t('sitename')} - {i18n.t('category.songwriters')}</title>
				</Head>

				<div className="kmx-filter-keyword">
					<form onSubmit={(event) => event.preventDefault()}>
						<input type="text" value={keywords} onChange={(event) => this.updateKeyword(event)} placeholder={i18n.t('form.tags_keywords_placeholder')} />
						<button type="submit"><i className="fa fa-search"></i></button>
					</form>
				</div>

				<div className="kmx-filter-line">
					<Pagination
						total={total}
						size={pageSize}
						current={page}
						renderUrl={(i) => { return filterTools.reset().setPage(i).getQuery('songwriters').url; }}
						/>
					<div className="kmx-filter-order">
						<label>{i18n.t('form.order_by')} :</label>
						<div key="alpha" onClick={(event) => this.updateOrder('alpha')} className={this.state.orderBy=="alpha" ? "active":""} >A-Z</div>
						<div key="quantity" onClick={(event) => this.updateOrder('quantity')} className={this.state.orderBy=="quantity" ? "active":""} >{i18n.t('form.kara_count')}</div>
					</div>
				</div>

				<DedicatedTagList type="songwriters" tags={tagList} pageSize={pageSize} page={page} orderBy={this.state.orderBy}/>

				<Pagination
					total={total}
					size={pageSize}
					current={page}
					renderUrl={(i) => { return filterTools.reset().setPage(i).getQuery('songwriters').url; }}
					/>
			</div>
			)
	}
}

export default withTranslation(['common','tag'])(Page)