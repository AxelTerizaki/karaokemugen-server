import { getConfig } from '../lib/utils/config';
import { gitlabPostNewIssue } from '../lib/services/gitlab';
import logger from '../lib/utils/logger';

export async function postSuggestionToKaraBase(karaName: string, username: string, series: string, link: string): Promise<string> {
	const conf = getConfig().Gitlab.IssueTemplate;
	let title = conf && conf.Suggestion && conf.Suggestion.Title
		? conf.Suggestion.Title
		: (series ? '$series - $kara' : '$kara');
	title = title.replace('$kara', karaName);
	title = title.replace('$series', series);
	let desc = conf && conf.Suggestion && conf.Suggestion.Description
		? conf.Suggestion.Description
		: `From $username : it would be nice if someone could time this!


$link`;
	desc = desc.replace('$username', username)
	desc = desc.replace('$link', link)
	try {
		return await gitlabPostNewIssue(title, desc, conf.Suggestion.Labels);
	} catch(err) {
		logger.error(`[KaraSuggestion] Call to Gitlab API failed : ${err}`);
	}
}