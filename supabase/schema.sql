-- Run this in the Supabase SQL editor to create backup tables.
--

create table if not exists users (
  id text primary key,
  email text not null,
  name text not null,
  picture text not null,
  logged_in_at timestamptz not null
);

create table if not exists profiles (
  user_id text primary key,
  first_name text not null,
  last_name text not null,
  sex text,
  date_of_birth text not null default '',
  height_cm numeric,
  weight_kg numeric,
  activity_level text not null
);

create table if not exists weight_entries (
  id text primary key,
  user_id text not null,
  date text not null,
  weight_kg numeric not null
);

create table if not exists body_measurements (
  id text primary key,
  user_id text not null,
  date text not null,
  neck_cm numeric,
  shoulders_cm numeric,
  chest_cm numeric,
  waist_cm numeric,
  hips_cm numeric,
  bicep_cm numeric,
  forearm_cm numeric,
  thigh_cm numeric,
  abdomen_cm numeric
);

create table if not exists workout_templates (
  id text primary key,
  user_id text not null,
  name text not null,
  type text not null,
  cardio_duration_minutes numeric,
  cardio_equipment text,
  exercises jsonb not null default '[]'::jsonb,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists workout_sessions (
  id text primary key,
  user_id text not null,
  template_id text not null,
  template_name text not null,
  type text not null,
  cardio_duration_minutes numeric,
  cardio_equipment text,
  cardio_completed boolean not null default false,
  status text not null,
  started_at timestamptz not null,
  completed_at timestamptz,
  exercises jsonb not null default '[]'::jsonb
);

create table if not exists workout_history (
  id text primary key,
  user_id text not null,
  template_id text not null,
  template_name text not null,
  session_id text not null,
  workout_type text not null,
  completed_at timestamptz not null,
  total_volume_kg numeric,
  cardio_duration_minutes numeric,
  cardio_equipment text,
  note text
);

create table if not exists exercise_set_history (
  id text primary key,
  user_id text not null,
  exercise_name text not null,
  date text not null,
  weight_kg numeric not null,
  reps numeric not null,
  session_id text not null,
  to_failure boolean
);

create table if not exists known_exercises (
  id text primary key,
  user_id text not null,
  name text not null,
  double_stats boolean
);

create table if not exists app_settings (
  id text primary key,
  language text not null
);

create index if not exists idx_weight_entries_user_id on weight_entries (user_id);
create index if not exists idx_body_measurements_user_id on body_measurements (user_id);
create index if not exists idx_workout_templates_user_id on workout_templates (user_id);
create index if not exists idx_workout_sessions_user_id on workout_sessions (user_id);
create index if not exists idx_workout_history_user_id on workout_history (user_id);
create index if not exists idx_exercise_set_history_user_id on exercise_set_history (user_id);
create index if not exists idx_known_exercises_user_id on known_exercises (user_id);

-- Simple open policies for a personal backup project.
-- Tighten these before sharing the anon key publicly.

alter table users enable row level security;
alter table profiles enable row level security;
alter table weight_entries enable row level security;
alter table body_measurements enable row level security;
alter table workout_templates enable row level security;
alter table workout_sessions enable row level security;
alter table workout_history enable row level security;
alter table exercise_set_history enable row level security;
alter table known_exercises enable row level security;
alter table app_settings enable row level security;

create policy "anon_all_users" on users for all using (true) with check (true);
create policy "anon_all_profiles" on profiles for all using (true) with check (true);
create policy "anon_all_weight_entries" on weight_entries for all using (true) with check (true);
create policy "anon_all_body_measurements" on body_measurements for all using (true) with check (true);
create policy "anon_all_workout_templates" on workout_templates for all using (true) with check (true);
create policy "anon_all_workout_sessions" on workout_sessions for all using (true) with check (true);
create policy "anon_all_workout_history" on workout_history for all using (true) with check (true);
create policy "anon_all_exercise_set_history" on exercise_set_history for all using (true) with check (true);
create policy "anon_all_known_exercises" on known_exercises for all using (true) with check (true);
create policy "anon_all_app_settings" on app_settings for all using (true) with check (true);
