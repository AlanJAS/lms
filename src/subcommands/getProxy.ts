/**
 * Resolve the proxy URL forwarded to the LM Studio download backend.
 *
 * This does not proxy the CLI's local WebSocket connection. The backend is
 * responsible for using the URL when making external HTTP(S) requests.
 */
export function resolveDownloadProxyUrl(
  explicitProxy: string | undefined,
  env: NodeJS.ProcessEnv,
): string | undefined {
  const candidate =
    explicitProxy ??
    env.HTTPS_PROXY ??
    env.https_proxy ??
    env.HTTP_PROXY ??
    env.http_proxy;
  if (candidate === undefined || candidate.trim() === "") {
    return undefined;
  }

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error("Invalid proxy URL. Expected an absolute HTTP(S) URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Unsupported proxy URL scheme. Use http:// or https://.");
  }
  if (url.hostname === "") {
    throw new Error("Proxy URL must include a hostname.");
  }
  return candidate;
}
