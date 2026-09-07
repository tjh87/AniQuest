import { env } from "cloudflare:workers";
import { notFound } from "next/navigation";
import { getChatGPTUser, requireChatGPTUser, type ChatGPTUser } from "./chatgpt-auth";

function isConfiguredAdmin(user: ChatGPTUser): boolean {
  const configured = (env as unknown as { ANIQUEST_ADMIN_EMAIL?: string }).ANIQUEST_ADMIN_EMAIL ?? "";
  const allowed = configured.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(user.email.trim().toLowerCase());
}

export async function getAdminUser(): Promise<ChatGPTUser | null> {
  const user = await getChatGPTUser();
  return user && isConfiguredAdmin(user) ? user : null;
}

export async function requireAdminUser(): Promise<ChatGPTUser> {
  const user = await requireChatGPTUser("/room");
  if (!isConfiguredAdmin(user)) notFound();
  return user;
}
