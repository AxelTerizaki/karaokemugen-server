import React from 'react'
import { i18n, withTranslation } from '../i18n'
import Head from 'next/head'
import DedicatedTagtList from '../components/DedicatedTagList';
import FilterTools from '../utils/filterTools';
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
		}
		filterTools.setParams(props.filterParams);
	}

	componentWillUpdate(nextProps, nextState) {
		filterTools.setParams(nextProps.filterParams);
	}

	render() {
		let kmax = 1;

		let tagList = [];
		for (let id in this.props.years) {
			let v = this.props.years[id];
			kmax = Math.max(kmax,v.karacount);
			tagList.push(v);
		}

		tagList.sort((a,b) => {
			return b.year - a.year;
		})

		tagList = tagList.map((tag) => {
			var height = 100 * tag.karacount / kmax;
			return {
				key: tag.year,
				name : tag.year,
				karacount : tag.karacount,
				link : filterTools.clear().addTag('year',tag.year).getQuery().url,
				height : height
			};
		})

		return (
			<div>
				<Head>
				<title key="title">{i18n.t('sitename')} - {i18n.t('category.years')}</title>
				</Head>
				<DedicatedTagtList type="years" tags={tagList} orderBy='alpha' />
			</div>
			)
	}
}

export default withTranslation(['common','tag'])(Page)