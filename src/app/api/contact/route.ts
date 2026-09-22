import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { validContact } from "@/lib/contact-validation";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Contact service is not configured." }, { status: 503 });
  }

  let body: FormData;
  try { body = await request.formData(); }
  catch { return NextResponse.json({ error: "Məlumat formatı düzgün deyil." }, { status: 400 }); }
  if (String(body.get("website") ?? "")) return NextResponse.json({ ok: true });

  const fullName = String(body.get("full_name") ?? "").trim();
  const phone = String(body.get("phone") ?? "").trim();
  const email = String(body.get("email") ?? "").trim() || null;
  const goal = String(body.get("goal") ?? "").trim() || null;
  const interest = String(body.get("interest") ?? "").trim() || null;
  const level = String(body.get("level") ?? "").trim() || null;

  if (!validContact({ fullName, phone, email, goal, interest, level })) {
    return NextResponse.json({ error: "Məlumatları yoxlayın." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    full_name: fullName,
    phone,
    email,
    interest,
    level,
    goal
  });

  if (error) return NextResponse.json({ error: "Müraciət göndərilmədi." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

