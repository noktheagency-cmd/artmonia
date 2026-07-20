import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Contact service is not configured." }, { status: 503 });
  }

  const body = await request.formData();
  if (String(body.get("website") ?? "")) return NextResponse.json({ ok: true });

  const fullName = String(body.get("full_name") ?? "").trim();
  const phone = String(body.get("phone") ?? "").trim();
  const email = String(body.get("email") ?? "").trim() || null;
  const goal = String(body.get("goal") ?? "").trim() || null;

  if (fullName.length < 2 || fullName.length > 120 || phone.length < 5 || phone.length > 40 || (goal?.length ?? 0) > 2000) {
    return NextResponse.json({ error: "Məlumatları yoxlayın." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    full_name: fullName,
    phone,
    email,
    interest: String(body.get("interest") ?? "").trim() || null,
    level: String(body.get("level") ?? "").trim() || null,
    goal
  });

  if (error) return NextResponse.json({ error: "Müraciət göndərilmədi." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

