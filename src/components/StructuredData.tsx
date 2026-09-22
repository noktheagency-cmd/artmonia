import { serializeSchema } from "@/lib/seo";

export default function StructuredData({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(data) }} />;
}
