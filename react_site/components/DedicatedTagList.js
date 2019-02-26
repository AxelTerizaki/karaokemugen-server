import React from 'react'
import { i18n, withNamespaces } from '../i18n'
import Link from '../utils/I18nLink';
import RuntimeConfig from '../utils/RuntimeConfig';
const BASE_URL = RuntimeConfig.BASE_URL;
const API_URL = RuntimeConfig.API_URL;

class DedicatedTagList extends React.Component {
	render() {

		let tagList = this.props.tags.map((tag) => {
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
		})

		return (
			<ul className="kmx-dedicated-taglist" data-type={this.props.type}>
				{tagList}
			</ul>
		);
	}
}

export default withNamespaces('common')(DedicatedTagList)