export const APP_VIEW_IDS = [
  "home", "journey", "learn", "atlas", "quiz", "field", "news", "singapore", "calendar", "collection",
] as const;

export type ViewId = (typeof APP_VIEW_IDS)[number];

export const VIEW_LABELS: Record<ViewId, string> = {
  home: "Home",
  journey: "Otter journey",
  learn: "Learn",
  atlas: "Atlas",
  quiz: "Quiz",
  field: "Field Lab",
  news: "News",
  singapore: "Singapore Wild",
  calendar: "Wildlife Calendar",
  collection: "Collection",
};

const APP_VIEW_ID_SET = new Set<string>(APP_VIEW_IDS);

export function isAppViewId(value: unknown): value is ViewId {
  return typeof value === "string" && APP_VIEW_ID_SET.has(value);
}
