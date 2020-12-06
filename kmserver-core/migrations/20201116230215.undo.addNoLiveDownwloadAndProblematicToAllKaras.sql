drop materialized view all_karas;
drop materialized view all_kara_tag;

create materialized view all_kara_tag as
SELECT k.pk_kid                                                                              AS kid,
       jsonb_agg(DISTINCT t.tagfile)                                                         AS tagfiles,
       jsonb_agg(DISTINCT (t.pk_tid || '~'::text) || kt.type)                                AS tid,
       to_tsvector('unaccent_conf'::regconfig, btrim(
               regexp_replace(jsonb_agg(t.aliases)::character varying::text, '[\]\,\[\"]'::text, ''::text,
                              'g'::text)))                                                   AS aliases,
       to_tsvector('unaccent_conf'::regconfig, regexp_replace(
               regexp_replace(jsonb_agg(DISTINCT t.i18n)::text, '".+?": "(.+?)"'::text, '\1'::text, 'g'::text),
               '[\[\{\}\],]'::text, ''::text, 'g'::text))                                    AS i18n,
       to_tsvector('unaccent_conf'::regconfig, string_agg(DISTINCT t.name::text, ' '::text)) AS tags
FROM kara k
         LEFT JOIN kara_tag kt ON k.pk_kid = kt.fk_kid
         LEFT JOIN tag t ON kt.fk_tid = t.pk_tid
GROUP BY k.pk_kid;

create materialized view all_karas as
SELECT k.pk_kid                                                                                          AS kid,
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
       k.subchecksum,
       akt.tid,
       akt.tagfiles,
       ((akt.tags || akt.i18n) || akt.aliases) ||
       to_tsvector('unaccent_conf'::regconfig, k.title::text)                                            AS search_vector,
       singers.singers,
       series.series,
       COALESCE(lower(unaccent(series.series_sortable)),
                lower(unaccent(singers.singers_sortable)))                                               AS serie_singer_sortable,
       songtypes.songtypes,
       songtypes.songtypes_sortable,
       creators.creators,
       languages.languages,
       languages.languages_sortable,
       authors.authors,
       misc.misc,
       songwriters.songwriters,
       groups.groups,
       families.families,
       genres.genres,
       platforms.platforms,
       origins.origins,
       k.repository
FROM kara k
         LEFT JOIN all_kara_tag akt ON k.pk_kid = akt.kid
         LEFT JOIN kara_tag kt ON k.pk_kid = kt.fk_kid
         LEFT JOIN tag t ON kt.fk_tid = t.pk_tid
         LEFT JOIN singers ON k.pk_kid = singers.fk_kid
         LEFT JOIN songtypes ON k.pk_kid = songtypes.fk_kid
         LEFT JOIN creators ON k.pk_kid = creators.fk_kid
         LEFT JOIN languages ON k.pk_kid = languages.fk_kid
         LEFT JOIN authors ON k.pk_kid = authors.fk_kid
         LEFT JOIN misc ON k.pk_kid = misc.fk_kid
         LEFT JOIN songwriters ON k.pk_kid = songwriters.fk_kid
         LEFT JOIN groups ON k.pk_kid = groups.fk_kid
         LEFT JOIN families ON k.pk_kid = families.fk_kid
         LEFT JOIN origins ON k.pk_kid = origins.fk_kid
         LEFT JOIN genres ON k.pk_kid = genres.fk_kid
         LEFT JOIN platforms ON k.pk_kid = platforms.fk_kid
         LEFT JOIN series ON k.pk_kid = series.fk_kid
GROUP BY k.pk_kid, languages.languages_sortable,
         (COALESCE(lower(unaccent(series.series_sortable)), lower(unaccent(singers.singers_sortable)))),
         songtypes.songtypes_sortable, singers.singers, songtypes.songtypes, groups.groups, songwriters.songwriters,
         misc.misc, authors.authors, languages.languages, creators.creators, platforms.platforms, genres.genres,
         origins.origins, families.families, series.series, akt.tid, akt.aliases, akt.tags, akt.i18n, akt.tagfiles
ORDER BY languages.languages_sortable,
         (COALESCE(lower(unaccent(series.series_sortable)), lower(unaccent(singers.singers_sortable)))),
         songtypes.songtypes_sortable DESC, k.songorder;

create index idx_ak_search_vector
    on all_karas using gin (search_vector);

create index idx_ak_created
    on all_karas (created_at desc);

create index idx_ak_serie
    on all_karas (series);

create index idx_ak_songtypes
    on all_karas (songtypes_sortable desc);

create index idx_ak_songorder
    on all_karas (songorder);

create index idx_ak_title
    on all_karas (title);

create index idx_ak_series_singers
    on all_karas (serie_singer_sortable);

create index idx_ak_language
    on all_karas (languages_sortable);

create index idx_ak_year
    on all_karas (year);

create index idx_ak_kid
    on all_karas (kid);

