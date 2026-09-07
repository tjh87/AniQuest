import type { SourceLink } from "./source-registry";
import {
  classifyLinkFailure, classifyLinkResponse, isApprovedCheckUrl,
  type LinkHealthStatus,
} from "./source-url-policy";

const CHECK_CONCURRENCY = 8;
const CHECK_TIMEOUT_MS = 2_500;
const MAX_REDIRECTS = 2;

/** Include HEAD/GET fallback at every permitted redirect plus time to save results. */
export function sourceScanLeaseSeconds(sourceCount: number) {
  return Math.ceil(sourceCount / CHECK_CONCURRENCY) * (MAX_REDIRECTS + 1) * 2 * CHECK_TIMEOUT_MS / 1000 + 90;
}

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export type SourceCheckResult = {
  url: string;
  status: LinkHealthStatus;
  httpStatus: number | null;
  detail: string;
  failureStreak: number;
  latencyMs: number | null;
  checkedAt: string;
  approvedHost: boolean;
};

function cancelBody(response: Response) {
  if (!response.body) return;
  void response.body.cancel().catch(() => undefined);
}

async function fetchWithTimeout(fetchImpl: FetchLike, url: string, method: "HEAD" | "GET") {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);
  try {
    return await fetchImpl(url, {
      method,
      redirect: "manual",
      signal: controller.signal,
      headers: {
        accept: "text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.1",
        ...(method === "GET" ? { range: "bytes=0-0" } : {}),
        "user-agent": "AniQuest-Source-Health/1.0 (+source quality check)",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function checkSourceLink(
  source: SourceLink,
  previousFailures = 0,
  fetchImpl: FetchLike = fetch,
): Promise<SourceCheckResult> {
  const startedAt = Date.now();
  const checkedAt = new Date().toISOString();
  if (!isApprovedCheckUrl(source.url)) {
    return {
      url: source.url, status: "unchecked", httpStatus: null, failureStreak: previousFailures,
      latencyMs: null, checkedAt, approvedHost: false,
      detail: "Automatic checks are not enabled for this source host. Review it manually before approval.",
    };
  }

  let currentUrl = source.url;
  const visited = new Set<string>();
  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
      if (visited.has(currentUrl)) {
        return {
          url: source.url, status: "warning", httpStatus: null, failureStreak: previousFailures,
          latencyMs: Date.now() - startedAt, checkedAt, approvedHost: true,
          detail: "The source entered a redirect loop and needs review.",
        };
      }
      visited.add(currentUrl);

      let response = await fetchWithTimeout(fetchImpl, currentUrl, "HEAD");
      if (response.status === 405) {
        cancelBody(response);
        response = await fetchWithTimeout(fetchImpl, currentUrl, "GET");
      }

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        cancelBody(response);
        if (!location) {
          return {
            url: source.url, status: "warning", httpStatus: response.status, failureStreak: previousFailures,
            latencyMs: Date.now() - startedAt, checkedAt, approvedHost: true,
            detail: `Source returned HTTP ${response.status} without a usable redirect location.`,
          };
        }
        const nextUrl = new URL(location, currentUrl).href;
        if (!isApprovedCheckUrl(nextUrl)) {
          return {
            url: source.url, status: "warning", httpStatus: response.status, failureStreak: previousFailures,
            latencyMs: Date.now() - startedAt, checkedAt, approvedHost: true,
            detail: "The source redirects to a host that is not approved for automatic checks.",
          };
        }
        if (hop === MAX_REDIRECTS) {
          return {
            url: source.url, status: "warning", httpStatus: response.status, failureStreak: previousFailures,
            latencyMs: Date.now() - startedAt, checkedAt, approvedHost: true,
            detail: "The source uses more redirects than the safe check limit.",
          };
        }
        currentUrl = nextUrl;
        continue;
      }

      const outcome = classifyLinkResponse(response.status, previousFailures);
      cancelBody(response);
      return {
        url: source.url, ...outcome, httpStatus: response.status,
        latencyMs: Date.now() - startedAt, checkedAt, approvedHost: true,
      };
    }
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    const outcome = classifyLinkFailure(timedOut ? "The source check timed out." : "The source could not be reached.", previousFailures);
    return {
      url: source.url, ...outcome, httpStatus: null,
      latencyMs: Date.now() - startedAt, checkedAt, approvedHost: true,
    };
  }

  const outcome = classifyLinkFailure("The source check did not complete.", previousFailures);
  return { url: source.url, ...outcome, httpStatus: null, latencyMs: Date.now() - startedAt, checkedAt, approvedHost: true };
}

export async function checkSourceLinks(
  sources: SourceLink[],
  previousFailures: Map<string, number>,
  fetchImpl: FetchLike = fetch,
  concurrency = CHECK_CONCURRENCY,
) {
  const results = new Array<SourceCheckResult>(sources.length);
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(Math.max(1, concurrency), sources.length) }, async () => {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= sources.length) return;
      const source = sources[index];
      results[index] = await checkSourceLink(source, previousFailures.get(source.canonicalKey) ?? 0, fetchImpl);
    }
  });
  await Promise.all(workers);
  return results;
}
