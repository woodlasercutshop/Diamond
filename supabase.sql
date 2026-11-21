-- Выполните в Supabase: SQL Editor -> New query -> Run
-- Скрипт можно запускать повторно.
create table if not exists dia (
  id text primary key,
  coll text not null,
  data jsonb not null,
  u bigint not null
);
create index if not exists dia_u_idx on dia (u);

-- Проверка каждой записи, которую присылает приложение.
create or replace function dia_ok(p_id text, p_coll text, p_data jsonb, p_u bigint)
returns boolean language sql stable as $$
  select p_coll in ('B','C','GH','GL','M','MP','O','P','R','S','U','V','ping')
     and p_id ~ '^[A-Za-z0-9_.-]{1,64}/[A-Za-z0-9_.-]{1,64}$'
     and split_part(p_id, '/', 1) = p_coll
     and jsonb_typeof(p_data) = 'object'
     and octet_length(p_data::text) <= 3000000
     and p_u >= 0
     and p_u <= (extract(epoch from now()) * 1000)::bigint + 86400000
$$;

-- Нельзя менять ключ и тип записи.
create or replace function dia_guard() returns trigger language plpgsql as $$
begin
  if new.id <> old.id or new.coll <> old.coll then
    raise exception 'dia: id and coll are immutable';
  end if;
  return new;
end $$;
drop trigger if exists dia_guard_t on dia;
create trigger dia_guard_t before update on dia for each row execute function dia_guard();

alter table dia enable row level security;
drop policy if exists "dia_open" on dia;
drop policy if exists "dia_read" on dia;
drop policy if exists "dia_ins" on dia;
drop policy if exists "dia_upd" on dia;
create policy "dia_read" on dia for select to anon using (true);
create policy "dia_ins" on dia for insert to anon with check (dia_ok(id, coll, data, u));
create policy "dia_upd" on dia for update to anon using (true) with check (dia_ok(id, coll, data, u));
-- Удаление строк запрещено. Приложение помечает удаление флагом del.
revoke delete, truncate on dia from anon;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke delete, truncate on dia from authenticated;
  end if;
end $$;
grant select, insert, update on dia to anon;

-- Мгновенные обновления (Realtime)
alter table dia replica identity full;
do $$ begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'dia') then
    alter publication supabase_realtime add table public.dia;
  end if;
end $$;
