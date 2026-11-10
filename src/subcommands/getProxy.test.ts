import { resolveDownloadProxyUrl } from "./getProxy.js";

describe("resolveDownloadProxyUrl", () => {
  it("uses the explicit flag before environment variables", () => {
    expect(resolveDownloadProxyUrl("http://localhost:8080", {
      HTTPS_PROXY: "http://elsewhere:3128",
    })).toBe("http://localhost:8080");
  });
  it("uses HTTPS_PROXY, then HTTP_PROXY", () => {
    expect(resolveDownloadProxyUrl(undefined, {
      HTTPS_PROXY: "http://secure-proxy:3128",
      HTTP_PROXY: "http://fallback:3128",
    })).toBe("http://secure-proxy:3128");
    expect(resolveDownloadProxyUrl(undefined, {
      HTTP_PROXY: "http://fallback:3128",
    })).toBe("http://fallback:3128");
  });
  it("supports lowercase proxy variables", () => {
    expect(resolveDownloadProxyUrl(undefined, {
      https_proxy: "http://proxy:9000",
    })).toBe("http://proxy:9000");
  });
  it("allows proxy credentials", () => {
    expect(resolveDownloadProxyUrl("http://user:password@proxy:3128", {}))
      .toBe("http://user:password@proxy:3128");
  });
  it("does not set a proxy when none is configured", () => {
    expect(resolveDownloadProxyUrl(undefined, {})).toBeUndefined();
  });
  it.each(["socks5://proxy:1080", "ftp://proxy:21", "not a url", "/proxy"])(
    "rejects invalid or unsupported proxy URL %s", input => {
      expect(() => resolveDownloadProxyUrl(input, {})).toThrow();
    },
  );
});
