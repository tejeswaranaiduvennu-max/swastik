import { requireAdmin } from "@/lib/admin/auth";
import { ExportPanel } from "@/components/admin/ExportPanel";

export const dynamic = "force-dynamic";

export default async function ExportsPage() {
  await requireAdmin();
  return <ExportPanel />;
}
