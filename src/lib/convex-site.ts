/**
 * The Convex deployment serves two origins:
 *   • *.convex.cloud — queries, mutations, actions (the React client)
 *   • *.convex.site  — HTTP actions (the file-part download route)
 *
 * The site origin is derived rather than configured so the app works on any
 * deployment, cloud or local.
 */
export function convexSiteUrl(): string {
  const raw = import.meta.env.VITE_CONVEX_URL as string | undefined;
  if (!raw) return "";
  try {
    const url = new URL(raw);
    const isLocal = ["localhost", "127.0.0.1"].includes(url.hostname);
    if (isLocal) {
      // Local dev runs the API on 3210 and HTTP actions on 3211.
      if (url.port === "3210") url.port = "3211";
    } else {
      url.hostname = url.hostname.replace(/\.convex\.cloud$/, ".convex.site");
    }
    return url.origin;
  } catch {
    return "";
  }
}
