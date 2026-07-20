import Link from "next/link";
import { Palette } from "lucide-react";
import { login } from "./actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/* The existing Artmonia logo needs its original proportions on the login artwork. */
/* eslint-disable @next/next/no-img-element */

export default async function AdminLogin({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <main className="admin-login-shell">
      <section className="admin-login-art" aria-hidden="true">
        <img src="/assets/artmonia-logo.webp" alt="" />
        <div>
          <Palette />
          <p>Sənət sistemini bir yerdən idarə edin.</p>
        </div>
      </section>
      <section className="admin-login-card">
        <Link href="/" className="admin-login-back">← Sayta qayıt</Link>
        <div className="admin-login-copy">
          <span>Artmonia Admin</span>
          <h1>Yenidən xoş gəldiniz.</h1>
          <p>Sayt məzmununu idarə etmək üçün hesabınıza daxil olun.</p>
        </div>
        {configured ? (
          <form action={login} className="admin-login-form">
            <label>
              <span>E-poçt</span>
              <input name="email" type="email" autoComplete="email" required placeholder="admin@artmonia.az" />
            </label>
            <label>
              <span>Şifrə</span>
              <input name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
            </label>
            {error ? <p className="admin-form-error">{error}</p> : null}
            <button type="submit">Daxil ol</button>
          </form>
        ) : (
          <div className="admin-demo-notice">
            <strong>Önizləmə rejimi</strong>
            <p>Paneli baxış məqsədilə aça bilərsiniz.</p>
            <Link href="/admin">Demo panelini aç</Link>
          </div>
        )}
      </section>
    </main>
  );
}
