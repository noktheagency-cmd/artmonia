-- Apply only after the app reads site_public_content.
drop policy if exists "Published site sections are public" on public.site_sections;
drop policy if exists "Authenticated users can read permitted site sections" on public.site_sections;
create policy "Admins read full site content" on public.site_sections for select to authenticated
  using ((select private.is_admin()));
revoke select on public.site_sections from anon;

-- Storage remove requires SELECT as well as DELETE. Do not delete referenced assets.
create policy "Admins inspect site media" on storage.objects for select to authenticated
  using (bucket_id = 'site-media' and (select private.is_admin()));
drop policy if exists "Admins can delete site media" on storage.objects;
create policy "Admins can delete unused site media" on storage.objects for delete to authenticated
  using (bucket_id = 'site-media' and (select private.is_admin()) and not exists (
    select 1 from public.media_assets m join public.site_sections s
      on position(m.public_url in s.content::text) > 0
      where m.path = objects.name
  ));
