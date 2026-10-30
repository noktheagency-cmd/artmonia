import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { seoCatalog } from "@/lib/seo-catalog";
import { cleanSeo, validateSeo, type PageSeo } from "@/lib/page-seo";
import type { JsonValue } from "@/lib/admin-content";

export const dynamic = "force-dynamic";
const reply = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
async function authorize() {
  if (!isSupabaseConfigured()) return { error: reply({ error: "Məlumat bağlantısı hazır deyil." }, 503) };
  const db = await createClient();
  const { data } = await db.auth.getUser();
  if (!data.user) return { error: reply({ error: "Admin hesabına daxil olun." }, 401) };
  const { data: admin } = await db.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) return { error: reply({ error: "Admin icazəsi tələb olunur." }, 403) };
  return { db, user: data.user };
}
export async function GET() {
  try {
    const auth = await authorize(); if (auth.error) return auth.error;
    const { data, error } = await auth.db.from("site_sections").select("content,updated_at").eq("key", "page_metadata").maybeSingle();
    if (error) return reply({ error: "Metadata yüklənmədi." }, 503);
    return reply({ pages: await seoCatalog(), overrides: data?.content ?? {}, version: data?.updated_at ?? null });
  } catch { return reply({ error: "Metadata yüklənmədi." }, 503); }
}
async function write(request: NextRequest, reset: boolean) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return reply({ error: "İcazəsiz sorğu." }, 403);
  try {
    const auth = await authorize(); if (auth.error) return auth.error;
    const text = await request.text(); if (text.length > 16000) return reply({ error: "Sorğu çox böyükdür." }, 413);
    let body; try { body = JSON.parse(text); } catch { return reply({ error: "JSON düzgün deyil." }, 400); }
    if (!body || typeof body.path !== "string" || !(body.version === null || typeof body.version === "string")) return reply({ error: "Səhifə və versiya tələb olunur." }, 400);
    if (!(await seoCatalog()).some(page => page.path === body.path)) return reply({ error: "Səhifə tapılmadı." }, 404);
    if (!reset) { const error = validateSeo(body.metadata); if (error) return reply({ error }, 400); }
    const { data: stored, error } = await auth.db.from("site_sections").select("id,content,updated_at").eq("key", "page_metadata").maybeSingle();
    if (error) return reply({ error: "Metadata yüklənmədi." }, 503);
    if ((stored?.updated_at ?? null) !== body.version) return reply({ error: "Məlumat başqa sessiyada dəyişib. Siyahını yeniləyin." }, 409);
    const content = { ...(stored?.content as Record<string, JsonValue> ?? {}) };
    if (reset) delete content[body.path]; else content[body.path] = cleanSeo(body.metadata as PageSeo);
    const payload = { content, updated_by: auth.user.id, is_published: true };
    const result = stored
      ? await auth.db.from("site_sections").update(payload).eq("id", stored.id).eq("updated_at", stored.updated_at).select("content,updated_at").maybeSingle()
      : await auth.db.from("site_sections").insert({ ...payload, key: "page_metadata", label: "Metadata", description: "Səhifələrin SEO məlumatları", category: "settings", sort_order: 100, created_by: auth.user.id }).select("content,updated_at").single();
    if (result.error || !result.data) return reply({ error: "Saxlanmadı. Siyahını yeniləyib təkrar cəhd edin." }, result.error ? (result.error.code === "23505" ? 409 : 500) : 409);
    revalidatePath(body.path);
    return reply({ overrides: result.data.content, version: result.data.updated_at });
  } catch { return reply({ error: "Metadata saxlanmadı." }, 500); }
}
export const PUT = (request: NextRequest) => write(request, false);
export const DELETE = (request: NextRequest) => write(request, true);
