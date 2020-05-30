// Shortener SQL


export const getInstance = `
SELECT modified_at,
	remote_ip4,
	local_ip4,
	local_port,
	ip6_prefix,
	ip6,
	instance_id
FROM short_url
WHERE remote_ip4 = $1
OR ip6_prefix >>= $1
`;

export const cleanupInstances = `
DELETE FROM short_url
WHERE modified_at <= $1
`;

export const upsertInstance = {
	ip4: `
INSERT INTO short_url
(modified_at, remote_ip4, local_ip4, local_port, instance_id)
VALUES($1, $2, $3, $4, $5)
ON CONFLICT (ip6_prefix, remote_ip4) DO UPDATE SET
   modified_at = $1,
   local_ip4 = $3,
   local_port = $4,
   instance_id = $5
;`,
	ip6: `
INSERT INTO short_url
(modified_at, ip6, ip6_prefix, local_port, instance_id)
VALUES($1, $2, $3, $4, $5)
ON CONFLICT (ip6_prefix, remote_ip4) DO UPDATE SET
   modified_at = $1,
   ip6 = $3,
   local_port = $4,
   instance_id = $5
;`,
	dual: `
INSERT INTO short_url
(modified_at, ip6_prefix, ip6, remote_ip4, local_ip4, local_port, instance_id)
VALUES($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (ip6_prefix, remote_ip4) DO UPDATE SET
	modified_at = $1,
	ip6_prefix = $2,
	ip6 = $3,
	remote_ip4 = $4,
	local_ip4 = $5,
	local_port = $6,
	instance_id = $7
;`,
};
