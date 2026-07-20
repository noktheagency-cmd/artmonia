import { redirect } from "next/navigation";
import AdminDashboard, { type AdminMessage, type MediaAsset } from "@/components/admin/AdminDashboard";
import { getAdminSections } from "@/lib/site-content";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const configured = isSupabaseConfigured();
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

    const [{ data: messageRows }, { data: mediaRows }] = await Promise.all([
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("media_assets").select("*").order("created_at", { ascending: false }).limit(100)
    ]);
    messages = (messageRows ?? []) as AdminMessage[];
    media = (mediaRows ?? []) as MediaAsset[];
  }

  const sections = await getAdminSections();
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
