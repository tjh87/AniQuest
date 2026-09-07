export const AUTO_CHECKED_HOSTS = new Set([
  "api.gbif.org",
  "www.opcf.org.hk",
  "www.afcd.gov.hk",
  "www.nas.gov.sg",
  "lkcnhm.nus.edu.sg",
  "www.ecologyasia.com",
  "reptile-database.reptarium.cz",
  "turtlesurvival.org",
  "herpetologynotes.org",
  "amphibiansoftheworld.amnh.org",
  "heronconservation.org",
  "peregrinefund.org",
  "railcorridor.nparks.gov.sg",
  "datazone.birdlife.org",
  "aias.au.dk",
  "www.researchgate.net",
  "www.allaboutbirds.org",

  "animaldiversity.org",
  "singaporebirds.com",
  "acres.org.sg",
  "nss.org.sg",
  "www.nss.org.sg",
  "spca.org.sg",
  "apnews.com",
  "avs.nparks.gov.sg",
  "biodiversitysg.nparks.gov.sg",
  "coralreef.nus.edu.sg",
  "doi.org",
  "juronglakegardens.nparks.gov.sg",
  "mothership.sg",
  "news.mongabay.com",
  "news.nus.edu.sg",
  "onlinelibrary.wiley.com",
  "singaporebirdgroup.wordpress.com",
  "www.birdlife.org",
  "www.channelnewsasia.com",
  "www.dbs.nus.edu.sg",
  "www.fisheries.noaa.gov",
  "www.iucnredlist.org",
  "mustsharenews.com",
  "www.nea.gov.sg",
  "www.nparks.gov.sg",
  "www.reuters.com",
  "www.science.nus.edu.sg",
  "www.sciencenews.org",
  "www.straitstimes.com",
  "www.theguardian.com",
  "www.weather.gov.sg",
  "www.mothership.sg",
  "www.mustsharenews.com",
]);

const BLOCKED_SUFFIXES = [".internal", ".local", ".localhost", ".test", ".invalid", ".example"];
const TRACKING_KEYS = new Set(["fbclid", "gclid", "mc_cid", "mc_eid"]);

function isIpLike(hostname: string) {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (host.includes(":")) return true;
  if (/^\d+(?:\.\d+){0,3}$/.test(host)) return true;
  if (/^0x[0-9a-f]+$/i.test(host)) return true;
  return false;
}

export function parsePublicHttpsUrl(value: string): URL | null {
  if (typeof value !== "string" || value.length > 500) return null;
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
    if (url.protocol !== "https:" || url.username || url.password) return null;
    if (url.port && url.port !== "443") return null;
    if (!hostname.includes(".") || hostname === "localhost" || isIpLike(hostname)) return null;
    if (BLOCKED_SUFFIXES.some((suffix) => hostname.endsWith(suffix))) return null;
    return url;
  } catch {
    return null;
  }
}

export function isPublicHttpsUrl(value: string) {
  return Boolean(parsePublicHttpsUrl(value));
}

export function isApprovedCheckUrl(value: string) {
  const url = parsePublicHttpsUrl(value);
  return Boolean(url && AUTO_CHECKED_HOSTS.has(url.hostname.toLowerCase().replace(/\.$/, "")));
}

export function canonicalSourceKey(value: string) {
  const url = parsePublicHttpsUrl(value);
  if (!url) return null;
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (key.toLowerCase().startsWith("utm_") || TRACKING_KEYS.has(key.toLowerCase())) url.searchParams.delete(key);
  }
  return url.href;
}

export type LinkHealthStatus = "healthy" | "warning" | "broken" | "unchecked";

export function classifyLinkResponse(status: number, previousFailures = 0): { status: LinkHealthStatus; failureStreak: number; detail: string } {
  if (status >= 200 && status < 300) return { status: "healthy", failureStreak: 0, detail: "Source responded successfully." };
  if (status === 404 || status === 410) return { status: "broken", failureStreak: previousFailures + 1, detail: `Source returned HTTP ${status}.` };
  if ([401, 403, 405, 429].includes(status)) return { status: "warning", failureStreak: previousFailures, detail: `Source returned HTTP ${status}; access may be restricted for automated checks.` };
  if (status >= 300 && status < 400) return { status: "warning", failureStreak: previousFailures, detail: `Source redirects with HTTP ${status}.` };
  const failureStreak = previousFailures + 1;
  return {
    status: failureStreak >= 3 ? "broken" : "warning",
    failureStreak,
    detail: `Source returned HTTP ${status}. ${failureStreak >= 3 ? "The failure repeated across checks." : "A later check will confirm whether this is temporary."}`,
  };
}

export function classifyLinkFailure(message: string, previousFailures = 0): { status: LinkHealthStatus; failureStreak: number; detail: string } {
  const failureStreak = previousFailures + 1;
  return {
    status: failureStreak >= 3 ? "broken" : "warning",
    failureStreak,
    detail: `${message} ${failureStreak >= 3 ? "The failure repeated across checks." : "A later check will confirm whether this is temporary."}`,
  };
}
