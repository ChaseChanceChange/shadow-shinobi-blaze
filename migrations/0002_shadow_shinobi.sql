-- Shadow Shinobi player world. Catalog content lives in TypeScript;
-- these tables are the live Operatives, Packs, Contracts, and Channels.

create table if not exists operatives (
  id serial primary key,
  user_id text not null unique,
  name text not null,
  enclave text not null,
  portrait text not null,
  standing integer not null default 1,
  insight integer not null default 0,
  strength integer not null default 5,
  speed integer not null default 5,
  essence_power integer not null default 5,
  defense integer not null default 5,
  health integer not null default 20,
  max_health integer not null default 20,
  essence integer not null default 12,
  max_essence integer not null default 12,
  coin integer not null default 50,
  lat integer not null default 0,
  lng integer not null default 0,
  location_kind text not null default 'settlement',
  settlement_id text,
  action text not null default 'idle',
  combat jsonb,
  stat_points integer not null default 0,
  role text not null default 'operative',
  kills integer not null default 0,
  contracts_done integer not null default 0,
  visited jsonb not null default '[]'::jsonb,
  recovered_keys jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists operatives_user_id_idx on operatives (user_id);

create table if not exists pack_items (
  id serial primary key,
  user_id text not null,
  item_id text not null,
  qty integer not null default 1,
  equipped text,
  unique (user_id, item_id)
);

create index if not exists pack_items_user_id_idx on pack_items (user_id);

create table if not exists contract_progress (
  user_id text not null,
  contract_id text not null,
  status text not null default 'locked',
  progress integer not null default 0,
  primary key (user_id, contract_id)
);

create table if not exists chat_messages (
  id serial primary key,
  channel text not null,
  place text not null,
  user_id text not null,
  name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_channel_idx on chat_messages (channel, created_at desc);
