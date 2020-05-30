export interface DBInstance {
	modified_at: Date
	remote_ip4: string
	local_ip4: string
	local_port: number
	instance_id: string,
	ip6_prefix?: string,
	ip6?: string
}
