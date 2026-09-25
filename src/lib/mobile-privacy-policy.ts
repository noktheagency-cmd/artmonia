import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

const policyPath = path.join(process.cwd(), "docs", "mobile-privacy-policy-web-az.md");

export async function getApprovedMobilePrivacyPolicy(): Promise<string | null> {
  try {
    const policy = await readFile(policyPath, "utf8");
    // Keep unreviewed placeholder text off the public route.
    if (/TƏSDİQ|QƏRAR TƏLƏB OLUNUR|\[[^\]]+\]/iu.test(policy)) return null;
    return policy;
  } catch {
    return null;
  }
}
