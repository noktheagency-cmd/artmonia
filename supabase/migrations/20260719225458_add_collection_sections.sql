insert into public.site_sections (
  key,
  label,
  description,
  category,
  content,
  is_published,
  sort_order
)
values
  (
    'student_results',
    'Nəticələr',
    'Tələbə işləri və inkişaf nəticələri',
    'content',
    '[]'::jsonb,
    true,
    180
  ),
  (
    'awards',
    'Mükafatlar',
    'Akademiyanın nailiyyətləri və mükafatları',
    'content',
    '[]'::jsonb,
    true,
    190
  )
on conflict (key) do update
set
  label = excluded.label,
  description = excluded.description,
  category = excluded.category,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order;
