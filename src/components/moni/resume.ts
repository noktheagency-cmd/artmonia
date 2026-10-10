import type { MoniPlan } from "@/data/moni";

const key = "artmonia:moni:course-return:v1";
type Resume = { goal: string; level: string; note: string; plan: MoniPlan; expires: number };
export function readResume(): Resume | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(key) || "null");
    if (value && value.expires > Date.now() && typeof value.goal === "string" && typeof value.level === "string" && typeof value.note === "string" && value.plan?.token && value.plan?.course && Array.isArray(value.plan?.steps)) return value;
    sessionStorage.removeItem(key);
  } catch { /* Storage may be unavailable. */ }
  return null;
}
export function saveResume(value: Omit<Resume, "expires">) {
  try { sessionStorage.setItem(key, JSON.stringify({ ...value, expires: Date.now() + 55 * 60 * 1000 })); } catch { /* Storage is optional. */ }
}
export function clearResume() {
  try { sessionStorage.removeItem(key); } catch { /* Storage is optional. */ }
}
