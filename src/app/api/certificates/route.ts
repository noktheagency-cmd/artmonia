import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPublishedContent } from "@/lib/site-content";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { defaultSections, type SiteSectionRecord } from "@/lib/admin-content";
import { certificateFor, certificateDetail, programSlug, validateCertificate, type Certificate } from "@/lib/certificates";
import { withProgramDetail, type Program } from "@/lib/program-content";

export const dynamic = "force-dynamic";
const reply = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(request: NextRequest) {
  try {
    const content = await getPublishedContent();
    const list = Array.isArray(content.courses) ? content.courses as Program[] : [];
    const slug = request.nextUrl.searchParams.get("program");
    const items = list.map((course) => ({ program: programSlug(course.title), programTitle: course.title, ...certificateFor(withProgramDetail(course).detail) }))
      .filter((item) => item.enabled && item.image && (!slug || item.program === slug));
    if (slug && !items.length) return reply({ error: "Sertifikat tapılmadı." }, 404);
    return reply({ certificates: items });
  } catch { return reply({ error: "Sertifikatları yükləmək mümkün olmadı." }, 503); }
}

export async function PUT(request: NextRequest) {
  // Cookie-authenticated writes are same-origin only.
  if (request.headers.get("origin") !== request.nextUrl.origin) return reply({ error: "İcazəsiz sorğu." }, 403);
  if (!isSupabaseConfigured()) return reply({ error: "Məlumat bağlantısı hazır deyil." }, 503);
  try {
    const db = await createClient();
    const { data: auth, error: authError } = await db.auth.getUser();
    if (authError || !auth.user) return reply({ error: "Admin hesabına daxil olun." }, 401);
    const { data: admin, error: adminError } = await db.from("admin_users").select("user_id").eq("user_id", auth.user.id).maybeSingle();
    if (adminError || !admin) return reply({ error: "Admin icazəsi tələb olunur." }, 403);
    const text = await request.text();
    if (text.length > 16000) return reply({ error: "Sorğu çox böyükdür." }, 413);
    let body;
    try { body = JSON.parse(text); } catch { return reply({ error: "JSON düzgün deyil." }, 400); }
    if (!body || typeof body.program !== "string" || !(body.version === null || typeof body.version === "string")) return reply({ error: "Proqram və versiya tələb olunur." }, 400);
    const invalid = validateCertificate(body.certificate);
    if (invalid) return reply({ error: invalid }, 400);
    const { data: stored, error } = await db.from("site_sections").select("*").eq("key", "courses").maybeSingle();
    if (error) return reply({ error: "Proqramlar yüklənmədi." }, 503);
    if ((stored?.updated_at ?? null) !== body.version) return reply({ error: "Proqramlar başqa sessiyada dəyişib. Səhifəni yeniləyin; dəyişikliklərin üzərinə yazılmadı." }, 409);
    const section = (stored ?? defaultSections.find((s) => s.key === "courses")!) as SiteSectionRecord;
    const list = Array.isArray(section.content) ? section.content as Program[] : [];
    const index = list.findIndex((course) => programSlug(course.title) === body.program);
    if (index < 0) return reply({ error: "Proqram tapılmadı." }, 404);
    const content = list.map((course, i) => i === index ? { ...course, detail: { ...course.detail, ...certificateDetail(body.certificate as Certificate) } } : course);
    const payload = { content, updated_by: auth.user.id };
    const result = stored
      ? await db.from("site_sections").update(payload).eq("id", stored.id).eq("updated_at", stored.updated_at).select().maybeSingle()
      : await db.from("site_sections").insert({ key: "courses", label: section.label, description: section.description, category: section.category, is_published: section.is_published, sort_order: section.sort_order, ...payload, created_by: auth.user.id }).select().single();
    if (result.error) return reply({ error: "Saxlama alınmadı. Səhifəni yeniləyib yenidən cəhd edin." }, result.error.code === "23505" ? 409 : 500);
    if (!result.data) return reply({ error: "Paralel dəyişiklik aşkarlandı. Səhifəni yeniləyin." }, 409);
    revalidatePath("/programlar/[slug]", "page");
    return reply({ section: result.data });
  } catch { return reply({ error: "Sertifikatı saxlamaq mümkün olmadı." }, 500); }
}
