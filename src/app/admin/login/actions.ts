"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function login(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/admin");

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) redirect(`/admin/login?error=${encodeURIComponent("E-poçt və ya şifrə yanlışdır.")}`);
  redirect("/admin");
}

