export const selectFavorites = `
SELECT uf.fk_kid AS kid
FROM  users_favorites uf
WHERE uf.fk_login = $1
`;

export const selectFavoritesFull = (filterClauses: string[], limitClause: string, offsetClause: string) => `
SELECT
  ak.kid AS kid,
  ak.title AS title,
  ak.songorder AS songorder,
  COALESCE(ak.series, '[]'::jsonb) AS series,
  COALESCE(ak.singers, '[]'::jsonb) AS singers,
  COALESCE(ak.songtypes, '[]'::jsonb) AS songtypes,
  COALESCE(ak.creators, '[]'::jsonb) AS creators,
  COALESCE(ak.songwriters, '[]'::jsonb) AS songwriters,
  ak.year AS year,
  COALESCE(ak.languages, '[]'::jsonb) AS langs,
  COALESCE(ak.authors, '[]'::jsonb) AS authors,
  COALESCE(ak.misc, '[]'::jsonb) AS misc,
  COALESCE(ak.origins, '[]'::jsonb) AS origins,
  COALESCE(ak.platforms, '[]'::jsonb) AS platforms,
  COALESCE(ak.families, '[]'::jsonb) AS families,
  COALESCE(ak.genres, '[]'::jsonb) AS genres,
  ak.duration AS duration,
  ak.created_at AS created_at,
  ak.modified_at AS modified_at,
  count(ak.kid) OVER()::integer AS count
  FROM all_karas AS ak
  INNER JOIN users_favorites AS f ON f.fk_kid = ak.kid
  WHERE f.fk_login = :username
  ${filterClauses.map(clause => 'AND (' + clause + ')').reduce((a, b) => (a + ' ' + b), '')}
ORDER BY ak.serie_singer_sortable, ak.songtypes_sortable DESC, ak.songorder, ak.languages_sortable, lower(unaccent(ak.title))
${limitClause}
${offsetClause}
`;

export const selectAllFavorites = `
SELECT uf.fk_kid AS kid
FROM  users_favorites uf
`;

export const insertFavorite = `
INSERT INTO users_favorites (fk_login, fk_kid)
VALUES($1, $2)
ON CONFLICT (fk_login, fk_kid) DO NOTHING;
`;

export const deleteFavorite = `
DELETE FROM users_favorites
WHERE fk_login = $1
AND fk_kid = $2
`;