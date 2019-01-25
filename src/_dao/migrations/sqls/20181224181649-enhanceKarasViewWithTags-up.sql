DROP MATERIALIZED VIEW all_karas;
CREATE MATERIALIZED VIEW all_karas AS
WITH series_i18n(serie_id, serie_langs) AS (
     SELECT sl.fk_id_serie, array_to_json(array_agg(json_build_object('lang', sl.lang, 'name', sl.name)))
     FROM serie_lang sl
     GROUP BY sl.fk_id_serie
), t_singer(tag_id, tagtype, singers) AS (
     SELECT t.tag_id, t.tagtype, array_to_json(array_agg(json_build_object('id', t.tag_id, 'name', t.name, 'slug', t.slug, 'karacount', t.karacount )))
     FROM all_tags t
     GROUP BY t.tag_id, t.tagtype
), t_songtype(tag_id, tagtype, songtypes) AS (
     SELECT t.tag_id, t.tagtype, array_to_json(array_agg(json_build_object('id', t.tag_id, 'name', t.name, 'slug', t.slug, 'karacount', t.karacount )))
     FROM all_tags t
     GROUP BY t.tag_id, t.tagtype
), t_creator(tag_id, tagtype, creators) AS (
     SELECT t.tag_id, t.tagtype, array_to_json(array_agg(json_build_object('id', t.tag_id, 'name', t.name, 'slug', t.slug, 'karacount', t.karacount )))
     FROM all_tags t
     GROUP BY t.tag_id, t.tagtype
), t_language(tag_id, tagtype, languages) AS (
     SELECT t.tag_id, t.tagtype, array_to_json(array_agg(json_build_object('id', t.tag_id, 'name', t.name, 'slug', t.slug, 'karacount', t.karacount )))
     FROM all_tags t
     GROUP BY t.tag_id, t.tagtype
), t_misc(tag_id, tagtype, misc) AS (
     SELECT t.tag_id, t.tagtype, array_to_json(array_agg(json_build_object('id', t.tag_id, 'name', t.name, 'slug', t.slug )))
     FROM all_tags t
     GROUP BY t.tag_id, t.tagtype
), t_author(tag_id, tagtype, authors) AS (
     SELECT t.tag_id, t.tagtype, array_to_json(array_agg(json_build_object('id', t.tag_id, 'name', t.name, 'slug', t.slug, 'karacount', t.karacount )))
     FROM all_tags t
     GROUP BY t.tag_id, t.tagtype
), t_group(tag_id, tagtype, groups) AS (
     SELECT t.tag_id, t.tagtype, array_to_json(array_agg(json_build_object('id', t.tag_id, 'name', t.name, 'slug', t.slug, 'karacount', t.karacount )))
     FROM all_tags t
     GROUP BY t.tag_id, t.tagtype
), t_songwriter(tag_id, tagtype, songwriters) AS (
     SELECT t.tag_id, t.tagtype, array_to_json(array_agg(json_build_object('id', t.tag_id, 'name', t.name, 'slug', t.slug, 'karacount', t.karacount )))
     FROM all_tags t
     GROUP BY t.tag_id, t.tagtype
)

SELECT
 k.pk_id_kara AS kara_id,
  k.kid,
  k.title,
  k.duration,
  k.gain,
  k.year,
  k.mediafile,
  k.subfile,
  k.created_at,
  k.modified_at,
  k.songorder,
  k.karafile,
  k.mediasize,
  jsonb_agg(DISTINCT(s.seriefile)) AS seriefiles,
  jsonb_agg(DISTINCT(s.sid)) AS sid,
  jsonb_agg(DISTINCT(s18.serie_langs)::jsonb) as serie_i18n,
  string_agg(DISTINCT(s.name),',') AS serie,
  jsonb_agg(DISTINCT(s.aliases)) AS serie_altname,
  array_agg(DISTINCT(s.pk_id_serie)) AS serie_id,
  jsonb_agg(DISTINCT(t_songtype.songtypes)::jsonb) AS songtype,
  jsonb_agg(DISTINCT(t_creator.creators)::jsonb) AS creator,
  jsonb_agg(DISTINCT(t_singer.singers)::jsonb) AS singer,jsonb_agg(DISTINCT(t_language.languages)::jsonb) AS language,
  jsonb_agg(DISTINCT(t_author.authors)::jsonb) AS author,
  jsonb_agg(DISTINCT(t_misc.misc)::jsonb) AS misc,
  jsonb_agg(DISTINCT(t_songwriter.songwriters)::jsonb) AS songwriter,
  jsonb_agg(DISTINCT(t_group.groups)::jsonb) AS group,
  array_agg(DISTINCT(kt.fk_id_tag)) AS all_tags_id
FROM kara k
LEFT JOIN kara_serie ks ON k.pk_id_kara = ks.fk_id_kara
LEFT JOIN serie s ON ks.fk_id_serie = s.pk_id_serie
LEFT JOIN series_i18n s18 ON s18.serie_id = ks.fk_id_serie
LEFT JOIN kara_tag kt ON k.pk_id_kara = kt.fk_id_kara
LEFT JOIN t_singer ON kt.fk_id_tag = t_singer.tag_id AND t_singer.tagtype = 2
LEFT JOIN t_songtype ON kt.fk_id_tag = t_songtype.tag_id AND t_songtype.tagtype = 3
LEFT JOIN t_creator ON kt.fk_id_tag = t_creator.tag_id AND t_creator.tagtype = 4
LEFT JOIN t_language ON kt.fk_id_tag = t_language.tag_id AND t_language.tagtype = 5
LEFT JOIN t_author ON kt.fk_id_tag = t_author.tag_id AND t_author.tagtype = 6
LEFT JOIN t_misc ON kt.fk_id_tag = t_misc.tag_id AND t_misc.tagtype = 7
LEFT JOIN t_group ON kt.fk_id_tag = t_group.tag_id AND t_group.tagtype = 9
LEFT JOIN t_songwriter ON kt.fk_id_tag = t_songwriter.tag_id AND t_songwriter.tagtype = 8
GROUP BY k.pk_id_kara
ORDER BY language, serie, singer, songtype DESC, songorder;

CREATE INDEX idx_ak_created ON all_karas(created_at DESC);
CREATE INDEX idx_ak_name ON all_karas(serie NULLS LAST);
CREATE INDEX idx_ak_songtype ON all_karas(songtype DESC);
CREATE INDEX idx_ak_songorder ON all_karas(songorder);
CREATE INDEX idx_ak_title ON all_karas(title);
CREATE INDEX idx_ak_singer ON all_karas(singer);

