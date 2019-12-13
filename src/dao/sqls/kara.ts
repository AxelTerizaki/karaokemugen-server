import { LangClause } from "../../lib/types/database";

// SQL for kara management

export const getAllKaras = (filterClauses: string[], lang: LangClause, typeClauses: string, orderClauses: string, havingClause: string, limitClause: string, offsetClause: string, statsSelectClause: string, statsJoinClause: string) => `SELECT
  ak.kid AS kid,
  ak.title AS title,
  ak.songorder AS songorder,
  COALESCE(
	  (SELECT array_to_string (array_agg(name), ', ') FROM all_kara_serie_langs WHERE kid = ak.kid AND lang = ${lang.main}),
	  (SELECT array_to_string (array_agg(name), ', ') FROM all_kara_serie_langs WHERE kid = ak.kid AND lang = ${lang.fallback}),
	  ak.serie) AS serie,
  ak.serie AS serie_orig,
  ak.serie_altname AS serie_altname,
  ak.serie_i18n AS serie_i18n,
  ak.seriefiles AS seriefiles,
  ak.sid AS sid,
  ak.subfile AS subfile,
  COALESCE(ak.singers, '[]'::jsonb) AS singers,
  COALESCE(ak.songtypes, '[]'::jsonb) AS songtypes,
  COALESCE(ak.creators, '[]'::jsonb) AS creators,
  COALESCE(ak.songwriters, '[]'::jsonb) AS songwriters,
  ak.year AS year,
  COALESCE(ak.languages, '[]'::jsonb) AS langs,
  COALESCE(ak.authors, '[]'::jsonb) AS authors,
  COALESCE(ak.groups, '[]'::jsonb) AS groups,
  COALESCE(ak.misc, '[]'::jsonb) AS misc,
  COALESCE(ak.origins, '[]'::jsonb) AS origins,
  COALESCE(ak.platforms, '[]'::jsonb) AS platforms,
  COALESCE(ak.families, '[]'::jsonb) AS families,
  COALESCE(ak.genres, '[]'::jsonb) AS genres,
  ak.mediafile AS mediafile,
  ak.karafile AS karafile,
  ak.duration AS duration,
  ak.gain AS gain,
  ak.created_at AS created_at,
  ak.modified_at AS modified_at,
  ak.mediasize AS mediasize,
  ak.repo AS repo,
  ak.tag_names AS tag_names,
  ak.tagfiles AS tagfiles,
  ${statsSelectClause}
  count(ak.kid) OVER()::integer AS count
FROM all_karas AS ak
${statsJoinClause}
LEFT OUTER JOIN kara_serie AS ks_main ON ks_main.fk_kid = ak.kid
LEFT OUTER JOIN serie_lang AS sl_main ON sl_main.fk_sid = ks_main.fk_sid AND sl_main.lang = ${lang.main}
LEFT OUTER JOIN kara_serie AS ks_fall ON ks_fall.fk_sid = ak.kid
LEFT OUTER JOIN serie_lang AS sl_fall ON sl_fall.fk_sid = ks_fall.fk_sid AND sl_fall.lang = ${lang.fallback}
WHERE 1 = 1
  ${filterClauses.map(clause => 'AND (' + clause + ')').reduce((a, b) => (a + ' ' + b), '')}
  ${typeClauses}
GROUP BY ak.kid, ak.title, ak.songorder, ak.serie, ak.serie_singer_sortable, ak.sid, ak.serie_altname, ak.serie_i18n, ak.seriefiles, ak.subfile, ak.singers, ak.songtypes, ak.creators, ak.songwriters, ak.year, ak.languages, ak.groups, ak.authors, ak.misc, ak.genres, ak.families, ak.platforms, ak.origins, ak.mediafile, ak.karafile, ak.duration, ak.gain, ak.created_at, ak.modified_at, ak.mediasize, ak.groups, ak.repo, ak.songtypes_sortable, ak.singers_sortable, ak.tag_names, ak.tagfiles
${havingClause}
ORDER BY ${orderClauses} ak.serie_singer_sortable, ak.songtypes_sortable DESC, ak.songorder, lower(unaccent(ak.title))
${limitClause}
${offsetClause}
`;

export const getYears = 'SELECT year, karacount::integer FROM all_years ORDER BY year';

export const selectBaseStats = `SELECT
(SELECT COUNT(tid) FROM all_tags WHERE types @> ARRAY[2])::integer AS singers,
(SELECT COUNT(tid) FROM all_tags WHERE types @> ARRAY[8])::integer AS songwriters,
(SELECT COUNT(tid) FROM all_tags WHERE types @> ARRAY[4])::integer AS creators,
(SELECT COUNT(tid) FROM all_tags WHERE types @> ARRAY[6])::integer AS authors,
(SELECT COUNT(pk_kid) FROM kara)::integer AS karas,
(SELECT COUNT(tid)::integer FROM all_tags WHERE types @> ARRAY[5] AND karacount::text NOT LIKE '{"count": 0}' ) AS languages,
(SELECT COUNT(pk_sid) FROM serie)::integer AS series,
(SELECT SUM(mediasize) FROM kara)::bigint AS mediasize,
(SELECT SUM(duration) FROM kara)::integer AS duration;
`;