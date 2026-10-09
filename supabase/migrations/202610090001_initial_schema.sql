create extension if not exists pgcrypto;

create type public.game_mode as enum ('likely', 'roast', 'guess', 'delulu');
create type public.room_status as enum ('lobby', 'playing', 'finished');
create type public.round_status as enum ('open', 'revealed', 'skipped');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 2 and 18),
  avatar text not null default '🤡',
  created_at timestamptz not null default now()
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique check (room_code ~ '^[A-HJ-NP-Z2-9]{6}$'),
  room_name text not null check (char_length(room_name) between 2 and 32),
  host_player_id uuid,
  game_mode public.game_mode not null,
  status public.room_status not null default 'lobby',
  settings jsonb not null default '{"rounds":5,"player_limit":8,"allow_self_vote":false}'::jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days')
);

create table public.room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 2 and 18),
  avatar text not null default '🤡',
  is_host boolean not null default false,
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique (room_id, user_id),
  unique (id, room_id)
);

create unique index room_players_unique_nickname on public.room_players(room_id, lower(nickname));
alter table public.rooms add constraint rooms_host_player_fk foreign key (host_player_id) references public.room_players(id) on delete set null deferrable initially deferred;

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  game_mode public.game_mode not null,
  category text not null,
  question_text text not null check (char_length(question_text) between 5 and 300),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.game_rounds (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  round_number integer not null check (round_number between 1 and 10),
  question_id uuid references public.questions(id),
  status public.round_status not null default 'open',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (room_id, round_number),
  unique (id, room_id)
);

create table public.votes (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  round_id uuid not null,
  voter_player_id uuid not null,
  target_player_id uuid not null,
  created_at timestamptz not null default now(),
  foreign key (round_id, room_id) references public.game_rounds(id, room_id) on delete cascade,
  foreign key (voter_player_id, room_id) references public.room_players(id, room_id) on delete cascade,
  foreign key (target_player_id, room_id) references public.room_players(id, room_id) on delete cascade,
  unique (round_id, voter_player_id),
  check (voter_player_id <> target_player_id)
);

create table public.answers (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  round_id uuid not null,
  player_id uuid not null,
  answer_text text not null check (char_length(answer_text) between 1 and 500),
  created_at timestamptz not null default now(),
  foreign key (round_id, room_id) references public.game_rounds(id, room_id) on delete cascade,
  foreign key (player_id, room_id) references public.room_players(id, room_id) on delete cascade,
  unique (round_id, player_id)
);

create table public.guesses (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  round_id uuid not null,
  answer_id uuid not null references public.answers(id) on delete cascade,
  guesser_player_id uuid not null,
  guessed_player_id uuid not null,
  created_at timestamptz not null default now(),
  foreign key (round_id, room_id) references public.game_rounds(id, room_id) on delete cascade,
  foreign key (guesser_player_id, room_id) references public.room_players(id, room_id) on delete cascade,
  foreign key (guessed_player_id, room_id) references public.room_players(id, room_id) on delete cascade,
  unique (answer_id, guesser_player_id)
);

create table public.scores (
  room_id uuid not null references public.rooms(id) on delete cascade,
  player_id uuid not null,
  score integer not null default 0 check (score >= 0),
  updated_at timestamptz not null default now(),
  primary key (room_id, player_id),
  foreign key (player_id, room_id) references public.room_players(id, room_id) on delete cascade
);

alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.room_players enable row level security;
alter table public.questions enable row level security;
alter table public.game_rounds enable row level security;
alter table public.votes enable row level security;
alter table public.answers enable row level security;
alter table public.guesses enable row level security;
alter table public.scores enable row level security;

-- Intentionally no client policies are granted here. Add narrow policies only
-- alongside trusted Edge Functions/RPCs that validate room membership, phase,
-- host ownership, and answer/vote reveal rules. Never use service-role keys in
-- the browser. Add only approved public questions before exposing SELECT access.
