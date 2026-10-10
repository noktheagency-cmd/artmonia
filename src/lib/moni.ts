import { createHmac, timingSafeEqual } from "node:crypto";
import { moniGoals, moniLevels, type MoniCourse, type MoniProfile } from "@/data/moni";

export function readMoniProfile(value: unknown): MoniProfile | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (!moniGoals.includes(data.goal as typeof moniGoals[number]) || !moniLevels.includes(data.level as typeof moniLevels[number])
    || typeof data.note !== "string" || data.note.length > 500) return null;
  // Personal contact details are collected later, never needed by the model.
  const note = data.note.trim().replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, "[e-poçt gizlədildi]")
    .replace(/\+?\d[\d\s().-]{6,}\d/g, "[nömrə gizlədildi]");
  return { goal: data.goal as string, level: data.level as string, note };
}

export function moniCourses(value: unknown): MoniCourse[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object" || item.published === false || typeof item.title !== "string" || !item.title.trim()) return [];
    const text = (field: string, max: number) => typeof item[field] === "string" ? item[field].slice(0, max) : "";
    return [{ id: String(index), title: text("title", 180), text: text("text", 700), details: text("details", 1800),
      duration: text("duration", 150), price: text("price", 150), image: text("image", 1000),
      href: `/programlar/${encodeURIComponent(item.title.toLowerCase().replace(/\s+/g, "-"))}` }];
  }).slice(0, 30);
}

export function readModelPlan(value: unknown, courses: MoniCourse[]) {
  if (!value || typeof value !== "object") return null;
  const plan = value as Record<string, unknown>;
  const course = courses.find((item) => item.id === plan.courseId);
  if (!course || typeof plan.reason !== "string" || !plan.reason.trim() || plan.reason.length > 600
    || !Array.isArray(plan.steps) || plan.steps.length !== 3
    || plan.steps.some((step) => typeof step !== "string" || !step.trim() || step.length > 90)) return null;
  // Commercial facts are rendered exclusively from CMS fields, never model prose.
  if (/https?:|www\.|\d|₼|\$|€|manat|azn|qiymət|endirim|zəmanət|yer qalıb|cədvəl/iu.test([plan.reason, ...plan.steps].join(" "))) return null;
  return { course, reason: plan.reason.trim(), steps: plan.steps as string[] };
}

type SignedPlan = { profile: MoniProfile; course: string; reason: string; steps: string[]; expires: number; id: string };
function secret() { return process.env.MONI_SIGNING_SECRET || process.env.OPENROUTER_API_KEY; }
export function signMoniPlan(plan: Omit<SignedPlan, "expires" | "id">) {
  const key = secret();
  if (!key) throw new Error("Moni is not configured");
  const payload = Buffer.from(JSON.stringify({ ...plan, expires: Date.now() + 60 * 60 * 1000, id: crypto.randomUUID() })).toString("base64url");
  return `${payload}.${createHmac("sha256", key).update(`moni-plan-v1:${payload}`).digest("base64url")}`;
}
export function verifyMoniPlan(token: string): SignedPlan | null {
  const key = secret();
  if (!key || token.length > 8000) return null;
  try {
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra) return null;
    const expected = createHmac("sha256", key).update(`moni-plan-v1:${payload}`).digest();
    const actual = Buffer.from(signature, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const result = JSON.parse(Buffer.from(payload, "base64url").toString()) as SignedPlan;
    return result.expires > Date.now() && readMoniProfile(result.profile) ? result : null;
  } catch { return null; }
}

// Best-effort per-instance guard. Use Vercel WAF / provider spending cap in production too.
const attempts = new Map<string, { count: number; expires: number }>();
export function allowMoniRequest(key: string, now = Date.now()) {
  for (const [id, entry] of attempts) if (entry.expires <= now) attempts.delete(id);
  if (attempts.size > 5000) return false;
  const entry = attempts.get(key) ?? { count: 0, expires: now + 10 * 60 * 1000 };
  entry.count++;
  attempts.set(key, entry);
  return entry.count <= 6;
}
