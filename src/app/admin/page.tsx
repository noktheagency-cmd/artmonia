import { redirect } from "next/navigation";
import AdminDashboard, { type AdminMessage, type MediaAsset } from "@/components/admin/AdminDashboard";
import { getAdminSections } from "@/lib/site-content";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { defaultSections } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const previewMode = process.env.NODE_ENV !== "production" && (await searchParams).demo === "1";
  const configured = isSupabaseConfigured() && !previewMode;
  if (!configured && !previewMode) throw new Error("Admin məlumat bağlantısı hazır deyil.");
  let adminName = "Administrator";
  let messages: AdminMessage[] = [];
  let media: MediaAsset[] = [];

  if (configured) {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) redirect("/admin/login");

    const { data: membership } = await supabase
      .from("admin_users")
      .select("display_name")
      .eq("user_id", authData.user.id)
      .maybeSingle();

    if (!membership) redirect(`/admin/login?error=${encodeURIComponent("Bu hesabın admin icazəsi yoxdur.")}`);
    adminName = membership.display_name;

    const [{ data: messageRows, error: messageError }, { data: mediaRows, error: mediaError }] = await Promise.all([
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).order("id").limit(100),
      supabase.from("media_assets").select("*").order("created_at", { ascending: false }).order("id").limit(100)
    ]);
    if (messageError || mediaError) throw new Error("Admin məlumatları yüklənmədi. Yenidən cəhd edin.");
    messages = (messageRows ?? []) as AdminMessage[];
    media = (mediaRows ?? []) as MediaAsset[];
  }

  const sections = previewMode ? defaultSections : await getAdminSections();
  return (
    <AdminDashboard
      initialSections={sections}
      initialMessages={messages}
      initialMedia={media}
      configured={configured}
      adminName={adminName}
    />
  );
}
