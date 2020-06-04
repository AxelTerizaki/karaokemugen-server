import {selectTags, selectTagByNameAndType, selectTag} from '../dao/tag';
import { TagParams, TagList, Tag } from '../lib/types/tag';
import { writeTagFile } from '../lib/dao/tagfile';
import { resolvedPathImport } from '../lib/utils/config';
import { findTagInImportedFiles } from '../dao/tagfile';
import { IDQueryResult } from '../lib/types/kara';
import { v4 as uuidV4 } from 'uuid';
import { DBTag } from '../lib/types/database/tag';
import { writeSeriesFile } from '../lib/dao/seriesfile';

export function formatTagList(tagList: DBTag[], from: number, count: number): TagList {
	return {
		infos: {
			count: count,
			from: from,
			to: from + tagList.length
		},
		content: tagList
	};
}

export async function getTags(params: TagParams) {
	const tags = await selectTags(params);
	return formatTagList(tags.slice(params.from || 0,
		(params.from || 0) + params.size || 999999999), params.from || 0, tags.length);
}

export async function getTag(tid: string) {
	let tag = await selectTag(tid);
	if (tag) return tag;
	// If no tag is found, check in import folder if we have a tag by the same name and type
	tag = await findTagInImportedFiles(tag.name, tag.types);
	if (tag) return tag;
	return null;
}

/* "Edit" a tag. Save its new version */
export async function editTag(_tid: string, tag: Tag, _opts: any) {
	await addTag(tag, null);
	return tag;
}

export async function addTag(tag: Tag, _opts: any) {
	tag.tid = uuidV4();
	await writeTagFile(tag, resolvedPathImport());
	if (tag.types.includes(1)) {
		await writeSeriesFile(tag, resolvedPathImport());
	}
	return tag;
}

export async function getOrAddTagID(tagObj: Tag): Promise<IDQueryResult> {
	let tag = await selectTagByNameAndType(tagObj.name, tagObj.types);
	if (tag) return {id: tag.tid, new: false};
	// If no tag is found, check in import folder if we have a tag by the same name and type
	tag = await findTagInImportedFiles(tagObj.name, tagObj.types);
	if (tag) return {id: tag.tid, new: false};
	tagObj.tid = uuidV4();
	await writeTagFile(tagObj, resolvedPathImport());
	if (tagObj.types.includes(1)) {
		await writeSeriesFile(tagObj, resolvedPathImport());
	}
	return {id: tagObj.tid, new: true};
}