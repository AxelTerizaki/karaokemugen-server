import React from 'react'
import { i18n, withTranslation } from '../i18n'
import FilterTools from '../utils/filterTools';
import icons from '../components/Icons';
import Link from '../utils/I18nLink';

const filterTools = new FilterTools();

class Header extends React.Component {

	constructor (props) {
		super(props)
		this.state = {
			dropdown:{
				tags:false,
			},
		}
	}

	toggleDropdown(k){
		let dropdown = this.state.dropdown;
		dropdown[k] = !dropdown[k];
		this.setState({dropdown:dropdown})
	}
	closeDropdown(k){
		let dropdown = this.state.dropdown;
		dropdown[k] = false;
		this.setState({dropdown:dropdown})
	}

	render() {
		var current_route = this.props.router ? this.props.router.route : '/';
		current_route = current_route ? current_route : '/';

		filterTools.setParams(this.props.filterParams);
		var karasURL = filterTools.reset().setPage(0).getQuery().url;
		return (
			<div>
				<header className="kmx-header">
					<div className="kmx-filters-menu">
						<dl className="kmx-filters-menu--list">
							<dd onClick={this.closeDropdown.bind(this,'tags')} key="index"      ><Link href={ "/?"         }><a className={current_route=="/"            ? "active":"inactive"}>{icons.home} {i18n.t('category.home')}</a></Link></dd>
							<dd onClick={this.closeDropdown.bind(this,'tags')} key="karas"      ><Link href={ karasURL     }><a className={current_route=="/karas"       ? "active":"inactive"}>{icons.karas} {i18n.t('category.karas')}</a></Link></dd>
							<dd onClick={this.closeDropdown.bind(this,'tags')} key="songtypes"  ><Link href={ "/songtypes" }><a className={current_route=="/songtypes"   ? "active":"inactive"}>{icons.songtypes} {i18n.t('category.songtypes')}</a></Link></dd>
							<dd key="tags">
								<button onClick={this.toggleDropdown.bind(this,'tags')}>{icons.tags} {i18n.t('category.tags')}</button>
								{
									this.state.dropdown.tags 
									? <dl className="kmx-filters-menu--dropdown">
										<dd onClick={this.closeDropdown.bind(this,'tags')} key="miscs"     ><Link href={ "/miscs?"     }><a className={current_route=="/miscs"       ? "active":"inactive"}>{icons.miscs} {i18n.t('category.miscs')}</a></Link></dd>
										<dd onClick={this.closeDropdown.bind(this,'tags')} key="groups"    ><Link href={ "/groups?"    }><a className={current_route=="/groups"      ? "active":"inactive"}>{icons.groups} {i18n.t('category.groups')}</a></Link></dd>
										<dd onClick={this.closeDropdown.bind(this,'tags')} key="families"  ><Link href={ "/families?"  }><a className={current_route=="/families"    ? "active":"inactive"}>{icons.families} {i18n.t('category.families')}</a></Link></dd>
										<dd onClick={this.closeDropdown.bind(this,'tags')} key="origins"   ><Link href={ "/origins?"   }><a className={current_route=="/origins"     ? "active":"inactive"}>{icons.origins} {i18n.t('category.origins')}</a></Link></dd>
										<dd onClick={this.closeDropdown.bind(this,'tags')} key="genres"    ><Link href={ "/genres?"    }><a className={current_route=="/genres"      ? "active":"inactive"}>{icons.genres} {i18n.t('category.genres')}</a></Link></dd>
										<dd onClick={this.closeDropdown.bind(this,'tags')} key="platforms" ><Link href={ "/platforms?" }><a className={current_route=="/platforms"   ? "active":"inactive"}>{icons.platforms} {i18n.t('category.platforms')}</a></Link></dd>
									</dl>
									: null
								}
							</dd>
							<dd onClick={this.closeDropdown.bind(this,'tags')} key="singers"    ><Link href={ "/singers?"     }><a className={current_route=="/singers"     ? "active":"inactive"}>{icons.singers} {i18n.t('category.singers')}</a></Link></dd>
							<dd onClick={this.closeDropdown.bind(this,'tags')} key="series"     ><Link href={ "/series?"      }><a className={current_route=="/series"      ? "active":"inactive"}>{icons.series} {i18n.t('category.series')}</a></Link></dd>
							<dd onClick={this.closeDropdown.bind(this,'tags')} key="songwriters"><Link href={ "/songwriters?" }><a className={current_route=="/songwriters" ? "active":"inactive"}>{icons.songwriters} {i18n.t('category.songwriters')}</a></Link></dd>
							<dd onClick={this.closeDropdown.bind(this,'tags')} key="creators"   ><Link href={ "/creators?"    }><a className={current_route=="/creators"    ? "active":"inactive"}>{icons.creators} {i18n.t('category.creators')}</a></Link></dd>
							<dd onClick={this.closeDropdown.bind(this,'tags')} key="authors"    ><Link href={ "/authors?"     }><a className={current_route=="/authors"     ? "active":"inactive"}>{icons.authors} {i18n.t('category.authors')}</a></Link></dd>
							<dd onClick={this.closeDropdown.bind(this,'tags')} key="languages"  ><Link href={ "/languages?"   }><a className={current_route=="/languages"   ? "active":"inactive"}>{icons.languages} {i18n.t('category.languages')}</a></Link></dd>
							<dd onClick={this.closeDropdown.bind(this,'tags')} key="years"      ><Link href={ "/years?"       }><a className={current_route=="/years"       ? "active":"inactive"}>{icons.years} {i18n.t('category.years')}</a></Link></dd>
							<dd onClick={this.closeDropdown.bind(this,'tags')} key="karaimport" ><a href={ "/import" }>{icons.kara_import} {i18n.t('category.kara_import')}</a></dd>
						</dl>
					</div>
					<div className="kmx-language-menu">
						<dl>
							<dd key="lng-en"><a onClick={() => i18n.changeLanguage('en')} className={i18n.language=="en" ? "active":""}>EN</a></dd>
							<dd key="lng-fr"><a onClick={() => i18n.changeLanguage('fr')} className={i18n.language=="fr" ? "active":""}>FR</a></dd>
						</dl>
					</div>
				</header>
			</div>
		)
	}
}

export default withTranslation('common')(Header)
