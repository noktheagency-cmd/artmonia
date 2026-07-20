drop policy if exists "Published site sections are public" on public.site_sections;
drop policy if exists "Admins can view all site sections" on public.site_sections;
drop policy if exists "Public media is readable" on public.media_assets;
drop policy if exists "Admins can view all media metadata" on public.media_assets;

create policy "Published site sections are public"
on public.site_sections for select to anon
using (is_published);

create policy "Authenticated users can read permitted site sections"
on public.site_sections for select to authenticated
using (is_published or (select private.is_admin()));

create policy "Public media is readable"
on public.media_assets for select to anon
using (is_public);

create policy "Authenticated users can read permitted media metadata"
on public.media_assets for select to authenticated
using (is_public or (select private.is_admin()));
