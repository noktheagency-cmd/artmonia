import { notFound, redirect } from "next/navigation";
import AdminPageContent from "@/components/admin/AdminPageContent";
import { isAdminView } from "@/lib/admin-routes";

export const dynamic = "force-dynamic";

export default async function AdminSectionPage({ params, searchParams }: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ demo?: string }>;
}) {
  const { section } = await params;
  if (!isAdminView(section)) notFound();
  if (section === "dashboard") {
    const preview = process.env.NODE_ENV !== "production" && (await searchParams).demo === "1";
    redirect(preview ? "/admin?demo=1" : "/admin");
  }
  return <AdminPageContent view={section} searchParams={searchParams} />;
}
