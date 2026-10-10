import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { validContact } from "@/lib/contact-validation";
import { verifyMoniPlan } from "@/lib/moni";

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
  let goal = String(body.get("goal") ?? "").trim() || null;
  let interest = String(body.get("interest") ?? "").trim() || null;
  let level = String(body.get("level") ?? "").trim() || null;
  let moniSubmissionId: string | undefined;
  const moniToken = String(body.get("moni_token") ?? "");
  if (moniToken) {
    const plan = verifyMoniPlan(moniToken);
    if (!plan || body.get("consent") !== "true") return NextResponse.json({ error: "Planın vaxtı bitib. Moni ilə yenidən plan hazırla." }, { status: 400 });
    interest = plan.course;
    moniSubmissionId = plan.id;
    level = plan.profile.level;
    goal = `[Moni AI]\nMəqsəd: ${plan.profile.goal}\nSəviyyə: ${plan.profile.level}\nProqram: ${plan.course}\nQeyd: ${plan.profile.note || "—"}\nTövsiyə: ${plan.reason}\nYol: ${plan.steps.join(" → ")}`;
  }

  if (!validContact({ fullName, phone, email, goal, interest, level })) {
    return NextResponse.json({ error: "Məlumatları yoxlayın." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    ...(moniSubmissionId ? { id: moniSubmissionId } : {}),
    full_name: fullName,
    phone,
    email,
    interest,
    level,
    goal
  });

  // A retry of this signed plan must not create another lead after a lost response.
  if (error && !(moniSubmissionId && error.code === "23505")) return NextResponse.json({ error: "Müraciət göndərilmədi." }, { status: 500 });
  if (moniToken && !error) console.info(JSON.stringify({ event: "moni_consultation_submitted", at: new Date().toISOString() }));
  return NextResponse.json({ ok: true });
}

