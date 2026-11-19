import AdminPageContent from "@/components/admin/AdminPageContent";

export const dynamic = "force-dynamic";

export default function AdminPage({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  return <AdminPageContent searchParams={searchParams} />;
}
