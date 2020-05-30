export interface ShortURLData {
	date: Date,
	remote_ip4?: string | string[],
	local_ip4?: string,
	local_port: number,
	instance_id: string,
	ip6?: string,
	ip6_prefix?: string
}

export interface InstanceData {
	IID: string,
	localIP4?: string,
	localPort: number,
	IP6Prefix?: string,
	IP6?: string,
	IP4?: string
}