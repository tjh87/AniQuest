import { AniQuestApp } from "./aniquest-app";
import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from "./chatgpt-auth";
import { getPublicSiteSettings } from "./site-settings";
import { getAdminUser } from "./admin-auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [user, settings, admin] = await Promise.all([getChatGPTUser(), getPublicSiteSettings(), getAdminUser()]);
  return (
    <AniQuestApp
      user={user ? { displayName: user.displayName, email: user.email } : null}
      signInPath={chatGPTSignInPath("/")}
      signOutPath={chatGPTSignOutPath("/")}
      settings={settings}
      isAdmin={Boolean(admin)}
    />
  );
}
