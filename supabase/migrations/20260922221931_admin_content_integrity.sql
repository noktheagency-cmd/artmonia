-- Safe public projection: private drafts never leave the admin table.
create table public.site_public_content (
  key text primary key,
  content jsonb not null default 'null'::jsonb,
  is_published boolean not null,
  sort_order integer not null default 0
);
alter table public.site_public_content enable row level security;
revoke all on public.site_public_content from anon, authenticated;
grant select on public.site_public_content to anon, authenticated;
create policy "Read sanitized public content" on public.site_public_content for select to anon, authenticated using (true);

create function private.public_section_content(section_key text, value jsonb, published boolean)
returns jsonb language sql immutable set search_path = '' as $$
  select case when not published then 'null'::jsonb
    when jsonb_typeof(value) = 'array' then
      coalesce((select jsonb_agg(
        case when section_key = 'student_testimonials' and item->>'anonymous' = 'true'
          then item || '{"name":""}'::jsonb else item end order by ord)
        from jsonb_array_elements(value) with ordinality entries(item, ord)
        where case when section_key = 'blog_posts' then item->>'published' = 'true'
          else coalesce(item->>'published','true') <> 'false' end), '[]'::jsonb)
    else value end;
$$;
revoke all on function private.public_section_content(text,jsonb,boolean) from public, anon, authenticated;

-- Only a trigger may write the projection. This is not an exposed RPC.
create function private.sync_public_content() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is not null and not private.is_admin() then
    raise exception 'Admin access required';
  end if;
  if TG_OP = 'DELETE' then
    insert into public.site_public_content(key, content, is_published, sort_order)
      values(old.key, 'null'::jsonb, false, old.sort_order)
      on conflict(key) do update set content='null'::jsonb, is_published=false;
    return old;
  end if;
  insert into public.site_public_content(key, content, is_published, sort_order)
    values(new.key, private.public_section_content(new.key,new.content,new.is_published),new.is_published,new.sort_order)
    on conflict(key) do update set content=excluded.content,is_published=excluded.is_published,sort_order=excluded.sort_order;
  return new;
end;
$$;
revoke all on function private.sync_public_content() from public, anon, authenticated;
create trigger sync_public_content after insert or update or delete on public.site_sections
  for each row execute function private.sync_public_content();
insert into public.site_public_content(key,content,is_published,sort_order)
  select key,private.public_section_content(key,content,is_published),is_published,sort_order from public.site_sections;

-- Admins can change their display name, not membership or identity.
revoke update on public.admin_users from authenticated;
grant update(display_name) on public.admin_users to authenticated;
create policy "Admins update own display name" on public.admin_users for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
