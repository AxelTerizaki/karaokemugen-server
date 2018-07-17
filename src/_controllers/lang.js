export const getLang = (req, res, next) => {
	const langs = req.get('accept-language');
	if (langs) {
		req.lang = langs.split(',')[0].substring(0,2);
	}
	next();
};