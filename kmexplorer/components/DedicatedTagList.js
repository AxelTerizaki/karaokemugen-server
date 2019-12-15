import React from 'react'
import { withTranslation } from '../i18n'
import Link from '../utils/I18nLink';

class DedicatedTagList extends React.Component {
	render() {

		let tagList = this.props.tags.filter((tag) => tag.karacount);
		tagList.sort((a,b) =>{
			if(this.props.orderBy === 'alpha')
				return typeof a.name === 'string' ? a.name.toLowerCase().localeCompare(b.name.toLowerCase()) : a.name > b.name;
			else
				return b.karacount - a.karacount;
		})
		if (typeof this.props.page === 'number' && typeof this.props.pageSize === 'number') {
			tagList = tagList.slice(this.props.page*this.props.pageSize,this.props.page*this.props.pageSize+this.props.pageSize);
		}

		tagList = tagList.map((tag) => {
			return (
				<li key={tag.key}>
					<Link href={tag.link}>
						<a>
							<span className="out" style={tag.height ? {height:(3+0.97*tag.height)+'%'}:null}>
								<span className="in">{tag.name} <em>({tag.karacount})</em></span>
							</span>
						</a>
					</Link>
				</li>
			);
		});

		return (
			<ul className="kmx-dedicated-taglist" data-type={this.props.type}>
				{tagList}
			</ul>
		);
	}
}

export default withTranslation('common')(DedicatedTagList)