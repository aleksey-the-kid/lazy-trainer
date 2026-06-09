-- User achievement unlocks (run in Supabase SQL Editor)

create table if not exists user_achievements (
  id text primary key,
  user_id text not null,
  achievement_id text not null,
  unlocked_at timestamptz not null
);

create index if not exists idx_user_achievements_user_id on user_achievements (user_id);

alter table user_achievements enable row level security;

create policy "anon_all_user_achievements" on user_achievements for all using (true) with check (true);
