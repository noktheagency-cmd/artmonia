drop policy if exists "Site media is publicly readable" on storage.objects;

create index if not exists media_assets_uploaded_by_idx
  on public.media_assets (uploaded_by);

create index if not exists site_sections_created_by_idx
  on public.site_sections (created_by);

create index if not exists site_sections_updated_by_idx
  on public.site_sections (updated_by);
