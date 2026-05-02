-- Rate-limit counters — replaces per-instance in-memory Map in lib/security.ts.
-- Each row tracks request count within a rolling window for a given key (ip+endpoint).
-- Rows are upserted on every request; expired rows cleaned up by the index.

create table if not exists rate_limits (
  key        text        not null,
  count      int         not null default 1,
  reset_at   timestamptz not null,
  primary key (key)
);

-- Let Postgres prune expired rows in a background autovacuum pass
create index if not exists rate_limits_reset_at_idx on rate_limits (reset_at);

-- RLS: this table is written by the service role only (server-side), never by anon
alter table rate_limits enable row level security;
-- No RLS policies needed — only service role accesses this table
