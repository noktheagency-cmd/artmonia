create extension if not exists "pgcrypto" with schema extensions;
create schema if not exists private;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Admin',
  created_at timestamptz not null default now()
);

create table public.site_sections (
  id uuid primary key default extensions.gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z0-9_]+$'),
  label text not null,
  description text not null default '',
  category text not null default 'website' check (category in ('website', 'academy', 'content', 'settings')),
  content jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  path text not null unique,
  public_url text not null,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  alt_text text not null default '',
  is_public boolean not null default true,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.contact_submissions (
  id uuid primary key default extensions.gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text not null check (char_length(phone) between 5 and 40),
  email text check (email is null or char_length(email) <= 255),
  interest text,
  level text,
  goal text check (goal is null or char_length(goal) <= 2000),
  status text not null default 'new' check (status in ('new', 'contacted', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index site_sections_published_sort_idx on public.site_sections (is_published, sort_order);
create index contact_submissions_status_created_idx on public.contact_submissions (status, created_at desc);
create index media_assets_created_idx on public.media_assets (created_at desc);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and exists (
      select 1 from public.admin_users
      where user_id = (select auth.uid())
    );
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger site_sections_set_updated_at
before update on public.site_sections
for each row execute function private.set_updated_at();

create trigger contact_submissions_set_updated_at
before update on public.contact_submissions
for each row execute function private.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.site_sections enable row level security;
alter table public.media_assets enable row level security;
alter table public.contact_submissions enable row level security;

create policy "Admins can view their own membership"
on public.admin_users for select to authenticated
using (user_id = (select auth.uid()));

create policy "Published site sections are public"
on public.site_sections for select to anon, authenticated
using (is_published or (select private.is_admin()));

create policy "Admins can create site sections"
on public.site_sections for insert to authenticated
with check ((select private.is_admin()) and created_by = (select auth.uid()) and updated_by = (select auth.uid()));

create policy "Admins can update site sections"
on public.site_sections for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()) and updated_by = (select auth.uid()));

create policy "Admins can delete site sections"
on public.site_sections for delete to authenticated
using ((select private.is_admin()));

create policy "Public media is readable"
on public.media_assets for select to anon, authenticated
using (is_public or (select private.is_admin()));

create policy "Admins can create media metadata"
on public.media_assets for insert to authenticated
with check ((select private.is_admin()) and uploaded_by = (select auth.uid()));

create policy "Admins can update media metadata"
on public.media_assets for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Admins can delete media metadata"
on public.media_assets for delete to authenticated
using ((select private.is_admin()));

create policy "Anyone can submit a contact request"
on public.contact_submissions for insert to anon, authenticated
with check (status = 'new');

create policy "Admins can view contact requests"
on public.contact_submissions for select to authenticated
using ((select private.is_admin()));

create policy "Admins can update contact requests"
on public.contact_submissions for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Admins can delete contact requests"
on public.contact_submissions for delete to authenticated
using ((select private.is_admin()));

grant select on public.admin_users to authenticated;
grant select on public.site_sections to anon;
grant select, insert, update, delete on public.site_sections to authenticated;
grant select on public.media_assets to anon;
grant select, insert, update, delete on public.media_assets to authenticated;
grant insert on public.contact_submissions to anon, authenticated;
grant select, update, delete on public.contact_submissions to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Site media is publicly readable"
on storage.objects for select to anon, authenticated
using (bucket_id = 'site-media');

create policy "Admins can upload site media"
on storage.objects for insert to authenticated
with check (bucket_id = 'site-media' and (select private.is_admin()));

create policy "Admins can replace site media"
on storage.objects for update to authenticated
using (bucket_id = 'site-media' and (select private.is_admin()))
with check (bucket_id = 'site-media' and (select private.is_admin()));

create policy "Admins can delete site media"
on storage.objects for delete to authenticated
using (bucket_id = 'site-media' and (select private.is_admin()));

comment on table public.admin_users is
  'Create the first Supabase Auth user, then insert that user id here from the SQL editor.';
