drop index short_url_ip6_prefix_remote_ip4_uindex;

alter table short_url rename column remote_ip4 to remote_ip;
alter table short_url alter column remote_ip set not null;

alter table short_url rename column local_ip4 to local_ip;
alter table short_url alter column local_ip set not null;

alter table short_url drop column ip6;
alter table short_url drop column ip6_prefix;

create unique index idx_shortener_remoteIP on short_url(remote_ip);