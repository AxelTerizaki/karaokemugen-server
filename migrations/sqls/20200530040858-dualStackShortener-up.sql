alter table short_url
    add ip6_prefix cidr;

alter table short_url
    add ip6 inet;

alter table short_url alter column remote_ip drop not null;
alter table short_url alter column local_ip drop not null;
alter table short_url rename column remote_ip to remote_ip4;
alter table short_url rename column local_ip to local_ip4;

drop index idx_shortener_remoteIP;

-- TODO: Replace that (see comment on MR)
create unique index short_url_ip6_prefix_remote_ip4_uindex
    on short_url (ip6_prefix, remote_ip4);
