DROP MATERIALIZED VIEW all_karas;
CREATE MATERIALIZED VIEW all_karas AS
SELECT
  k.pk_kid AS kid,
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
  aks.seriefiles AS seriefiles,
  aks.serie_altname AS serie_altname,
  aks.serie AS serie,
  aks.sid AS sid,
  aks.serie_i18n AS serie_i18n,
  singer.singers AS singers,
  aks.serie_names AS serie_names,
  singer.singers_sortable AS singers_sortable,
  songtype.songtypes AS songtypes,
  songtype.songtypes_sortable AS songtypes_sortable,
  creator.creators AS creators,
  language.languages AS languages,
  language.languages_sortable AS languages_sortable,
  author.authors AS authors,
  misc.misc_tags AS misc_tags,
  songwriter.songwriters AS songwriters,
  group_tags.groups AS groups,
  array_agg(DISTINCT(kt.fk_id_tag)) AS all_tags_id,
  string_agg(DISTINCT(t.name),' ') AS tags,
  k.fk_repo_name AS repo
FROM kara k
LEFT JOIN all_kara_series aks ON k.pk_kid = aks.kid
LEFT JOIN kara_tag kt ON k.pk_kid = kt.fk_kid
LEFT JOIN tag t ON kt.fk_id_tag = t.pk_id_tag
LEFT OUTER JOIN singer on k.pk_kid = singer.fk_kid
LEFT OUTER JOIN songtype on k.pk_kid = songtype.fk_kid
LEFT OUTER JOIN creator on k.pk_kid = creator.fk_kid
LEFT OUTER JOIN language on k.pk_kid = language.fk_kid
LEFT OUTER JOIN author on k.pk_kid = author.fk_kid
LEFT OUTER JOIN misc on k.pk_kid = misc.fk_kid
LEFT OUTER JOIN songwriter on k.pk_kid = songwriter.fk_kid
LEFT OUTER JOIN group_tags on k.pk_kid = group_tags.fk_kid
GROUP BY k.pk_kid, languages_sortable, songtypes_sortable, singers_sortable, singers, songtypes, groups, songwriters, misc_tags, authors, languages, creators, aks.seriefiles, aks.serie_orig, aks.serie_altname, aks.serie, aks.serie_names, aks.sid, aks.serie_i18n
ORDER BY languages_sortable, serie, singers_sortable, songtypes_sortable DESC, songorder;
