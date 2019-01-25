/** Requêtes SQL utilisées. */

export const insertKaras = `INSERT INTO kara(pk_id_kara, kid, title, year, songorder, mediafile, subfile, created_at,
	modified_at, gain, duration, karafile, mediasize)
	VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);`;

export const inserti18nSeries = 'INSERT INTO serie_lang(fk_id_serie, lang, name) VALUES((SELECT pk_id_serie FROM serie WHERE name = $3), $1, $2);';

export const insertSeries = 'INSERT INTO serie(pk_id_serie, name) VALUES($1, $2);';

export const insertTags = `INSERT INTO tag(pk_id_tag, tagtype, name)
	VALUES($1, $2, $3);`;

export const insertKaraTags = 'INSERT INTO kara_tag(fk_id_tag, fk_id_kara) VALUES($1, $2);';

export const insertKaraSeries = 'INSERT INTO kara_serie(fk_id_serie, fk_id_kara) VALUES($1, $2);';

export const updateSeries = 'UPDATE serie SET aliases = $1, seriefile = $3, sid = $4 WHERE name = $2 ;';

export const selectRequestKaras = 'SELECT fk_id_kara AS id_kara, kid FROM request;';

export const selectKaras = 'SELECT kara_id AS id_kara, kid FROM all_karas;';

export const selectViewcountKaras = 'SELECT fk_id_kara AS id_kara, kid FROM viewcount;';

export const deleteAll = `
TRUNCATE kara_tag RESTART IDENTITY;
TRUNCATE kara_serie RESTART IDENTITY;
TRUNCATE tag RESTART IDENTITY;
TRUNCATE serie RESTART IDENTITY;
TRUNCATE serie_lang RESTART IDENTITY;
TRUNCATE kara RESTART IDENTITY;
`;