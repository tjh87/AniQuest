import { chatGPTSignOutPath } from "../chatgpt-auth";
import { requireAdminUser } from "../admin-auth";
import { getAdminDashboard } from "../site-settings";
import { AdminRoom } from "./admin-room";
import { getSourceHealthSnapshot } from "../source-link-health";

export const dynamic = "force-dynamic";

export default async function RoomPage() {
  const admin = await requireAdminUser();
  const dashboard = await getAdminDashboard();
  const sourceHealth = await getSourceHealthSnapshot(dashboard.settings);
  return <AdminRoom adminName={admin.displayName} signOutPath={chatGPTSignOutPath("/")} initialDashboard={{ ...dashboard, sourceHealth }} />;
}
