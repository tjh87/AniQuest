import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AniQuestApp } from "../app/aniquest-app";
import { AniQuestLogo } from "../app/aniquest-logo";
import { DEFAULT_SITE_SETTINGS } from "../app/default-settings";
import { OfflineContext } from "../app/offline-context";
import "../app/globals.css";
import "../app/interface-design.css";

// This entrypoint neither imitates an account nor grants admin permissions.
const root = createRoot(document.getElementById("root")!);
if (window.location.pathname === "/room" || window.location.pathname.startsWith("/room/")) {
  root.render(<main className="room-content"><section className="aq-panel"><AniQuestLogo className="aq-room-local-logo" /><h1>Admin requires the server app</h1><p>This local edition does not expose an admin back door. Global settings, user statistics and account sign-in need the separately configured server.</p><a href="/">Return to AniQuest</a></section></main>);
} else {
  root.render(<StrictMode><OfflineContext.Provider value={true}><AniQuestApp user={null} signInPath="/" signOutPath="/" settings={DEFAULT_SITE_SETTINGS} isAdmin={false} localMode /></OfflineContext.Provider></StrictMode>);
}
