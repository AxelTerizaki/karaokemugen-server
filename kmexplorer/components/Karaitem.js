import React from 'react'
import { i18n, withTranslation } from '../i18n'
import Link from '../utils/I18nLink';
import isoLanguages from '../components/isoLanguages';
import icons from '../components/Icons';

class Karaitem extends React.Component {

	render() {
		// Todo variante resume/detail
		// - langue index = mul detail = liste complete
		// - pas de lien vers les média en mode index

		let filterTools = this.props.filterTools;

		const kara = this.props.data
		const tags = this.props.tags

		let renderMode = this.props.mode ? this.props.mode : 'compact';

		let quickTagUrl = function(type,value,slug)
		{
			return filterTools.reset().addTag(type,value,slug).getQuery().url;
		}

		let getI18nTagname = (v) => {
			if(tags)
			{
				let tag =  this.props.tags[v.tid]
				if(tag)
					return tag.i18n[isoLanguages("iso3",i18n.language)] || (tag.i18n['eng'] || tag.name)
			}
			return v.name;
		}

		let r18 = false;
		let singers = kara.singers.map((v,i) => {
			let url = quickTagUrl('singer',v.tid, v.name);
			return <Link href={url} key={'singer_'+i}><a data-type="singer" data-id={v.tid}>{icons.singer} {v.name}</a></Link>
		});
		let creators = kara.creators.map((v,i) => {
			let url = quickTagUrl('creator',v.tid, v.name);
			return <Link href={url} key={'creator_'+i}><a data-type="creator" data-id={v.tid}>{icons.creator} {v.name}</a></Link>
		});
		let authors = kara.authors.map((v,i) => {
			let url = quickTagUrl('author',v.tid, v.name);
			return <Link href={url} key={'author_'+i}><a data-type="author" data-id={v.tid}>{icons.author} {v.name}</a></Link>
		});
		let songwriters = kara.songwriters.map((v,i) => {
			let url = quickTagUrl('songwriter',v.tid, v.name);
			return <Link href={url} key={'songwriters'+i}><a data-type="songwriter" data-id={v.tid}>{icons.songwriter} {v.name}</a></Link>
		});
		let languages = kara.langs.map((v,i) => {
			let name = isoLanguages(v.name, i18n.language);
			let url = quickTagUrl('language',v.tid, name);
			return <Link href={url} key={'language'+i}><a data-type="language" data-id={v.tid}>{icons.language} {name}</a></Link>
		});
		let songtypes = kara.songtypes.map((v,i) => {
			let name = getI18nTagname(v);
			let url = quickTagUrl('songtype',v.tid, name);
			return <Link href={url} key={'songtype_'+i}><a data-type="songtype" data-id={v.tid}>{icons.songtype} {name} {kara.songorder}</a></Link>
		});
		let miscs = kara.misc.map((v,i) => {
			if (v.name === 'R18')
				r18 = true;
			let name = getI18nTagname(v);
			let url = quickTagUrl('misc',v.tid, name);
			return <Link href={url} key={'misc_'+i}><a data-type="misc" data-id={v.tid}>{icons.misc} {name}</a></Link>
		});
		let groups = kara.groups.map((v,i) => {
			let name = getI18nTagname(v);
			let url = quickTagUrl('group',v.tid,name);
			return <Link href={url} key={'group_'+i}><a data-type="group" data-id={v.tid}>{icons.group} {name}</a></Link>
		});
		let families = kara.families.map((v,i) => {
			let name = getI18nTagname(v);
			let url = quickTagUrl('family',v.tid,name);
			return <Link href={url} key={'family_'+i}><a data-type="family" data-id={v.tid}>{icons.family} {name}</a></Link>
		});
		let origins = kara.origins.map((v,i) => {
			let name = getI18nTagname(v);
			let url = quickTagUrl('origin',v.tid,name);
			return <Link href={url} key={'origin_'+i}><a data-type="origin" data-id={v.tid}>{icons.origin} {name}</a></Link>
		});
		let genres = kara.genres.map((v,i) => {
			let name = getI18nTagname(v);
			let url = quickTagUrl('genre',v.tid,name);
			return <Link href={url} key={'genre_'+i}><a data-type="genre" data-id={v.tid}>{icons.genre} {name}</a></Link>
		});
		let platforms = kara.platforms.map((v,i) => {
			let url = quickTagUrl('platform',v.tid, v.name);
			return <Link href={url} key={'platform_'+i}><a data-type="platform" data-id={v.tid}>{icons.platform} {v.name}</a></Link>
		});

		// on n'exploite que la série principale
		let serie_name = kara.serie;
		//console.log(kara);
		let serie_id = kara.sid;
		if(typeof kara.serie_i18n == "object" && kara.serie_i18n[0] && kara.serie_i18n[0].length)
		{
			kara.serie_i18n[0].forEach( function(v, i) {
				if(v.lang==isoLanguages("iso3",i18n.language))
				{
					serie_name = v.name;
				}
			});
		}

		var captionStyle = null;
		if (kara.mediafile.match(/^((?!\.mp3).)*$/) && kara.mediafile.match(/^((?!\.m4a).)*$/))
			captionStyle = {backgroundImage:"url('//kara.moe/previews/"+kara.kid+"."+kara.mediasize+".25.jpg'), url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAB3RJTUUH4QUeCAASlEDtqwAAArhQTFRFAAAA4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg////6rYzZQAAAOZ0Uk5TAAABAgMEBQYHCAkKCwwNDg8QERITFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS8wMTM0Njc5Ojs8PT4/QEFCQ0RGR0hJSktM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')"};
		var caption = <span className="caption" style={captionStyle}></span>
		if(kara.mediafile.match(/\.mp4$/) && !r18)
		{
			caption = <a className="caption" style={captionStyle} target="_blank" href={"http://live.karaokes.moe/?video="+kara.kid}><span>{icons.video_play}</span></a>
		}

		return (
			<div className="kmx-kara-item" data-mode={renderMode}>
				<div className="kmx-kara-item-first-line">
					<h2 className="title"><Link href={'/kara/'+filterTools.normalizeString(kara.title)+'/'+kara.kid} key="detail"><a>{kara.title}</a></Link></h2>
					<div className="tag-language">{languages}</div>
				</div>
				{caption}
				<div className="tags">
					{songtypes}
					{serie_name ? (<Link href={quickTagUrl('serie',serie_id,serie_name)} key="serie"><a data-type="serie" data-id={serie_id}><i className="fa fa-tv"></i> {serie_name}</a></Link>) : null}
					{kara.year ? (<Link href={quickTagUrl('year',kara.year, kara.year)} key="year"><a data-type="year" ><i className="fa fa-calendar"></i> {kara.year}</a></Link>) : null }
					{singers}
					{songwriters}
					{creators}
					{authors}
					{miscs}
					{groups}
					{families}
					{origins}
					{genres}
					{platforms}
				</div>
			</div>
		)
	}
}

export default withTranslation('common')(Karaitem)