import { execFile } from "node:child_process";
import process from "node:process";
import { promisify } from "node:util";
import { JSONRpcProvider } from "opnet";
import { EnvHttpProxyAgent, ProxyAgent } from "undici";

const execFileAsync = promisify(execFile);

function parseBooleanEnv(raw, defaultValue) {
  if (typeof raw === "undefined") return defaultValue;
  const value = String(raw).trim().toLowerCase();
  if (value === "1" || value === "true" || value === "yes" || value === "y") return true;
  if (value === "0" || value === "false" || value === "no" || value === "n") return false;
  throw new Error(`Invalid boolean env value: ${raw}`);
}

function trimOrEmpty(value) {
  return typeof value === "string" ? value.trim() : "";
}

function redactProxyUrlForLog(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.username || parsed.password) {
      parsed.username = parsed.username ? "****" : "";
      parsed.password = parsed.password ? "****" : "";
    }
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

function resolveProxyEnv() {
  const explicitProxyUrl = trimOrEmpty(process.env.OPNET_RPC_PROXY_URL);
  const explicitProxyAuthToken = trimOrEmpty(process.env.OPNET_RPC_PROXY_AUTH_TOKEN);
  const httpProxy = trimOrEmpty(process.env.HTTP_PROXY || process.env.http_proxy);
  const httpsProxy = trimOrEmpty(process.env.HTTPS_PROXY || process.env.https_proxy);
  const noProxy =
    trimOrEmpty(process.env.OPNET_RPC_NO_PROXY) ||
    trimOrEmpty(process.env.NO_PROXY || process.env.no_proxy);

  const hasStandardProxyEnv = Boolean(httpProxy || httpsProxy);
  const useEnvProxy = parseBooleanEnv(process.env.OPNET_RPC_USE_ENV_PROXY, true);

  return {
    explicitProxyUrl,
    explicitProxyAuthToken,
    httpProxy,
    httpsProxy,
    noProxy,
    hasStandardProxyEnv,
    useEnvProxy,
  };
}

function resolveCurlProxyUrl(proxyEnv) {
  if (proxyEnv.explicitProxyUrl) return proxyEnv.explicitProxyUrl;
  if (proxyEnv.useEnvProxy && proxyEnv.hasStandardProxyEnv) return proxyEnv.httpsProxy || proxyEnv.httpProxy;
  return "";
}

function buildCurlEnv(proxyEnv) {
  const env = { ...process.env };
  if (proxyEnv.explicitProxyUrl) {
    env.HTTP_PROXY = "";
    env.HTTPS_PROXY = "";
    env.http_proxy = "";
    env.https_proxy = "";
    return env;
  }
  if (proxyEnv.useEnvProxy && proxyEnv.hasStandardProxyEnv) {
    if (proxyEnv.httpProxy) {
      env.HTTP_PROXY = proxyEnv.httpProxy;
      env.http_proxy = proxyEnv.httpProxy;
    }
    if (proxyEnv.httpsProxy) {
      env.HTTPS_PROXY = proxyEnv.httpsProxy;
      env.https_proxy = proxyEnv.httpsProxy;
    }
    if (proxyEnv.noProxy) {
      env.NO_PROXY = proxyEnv.noProxy;
      env.no_proxy = proxyEnv.noProxy;
    }
  }
  return env;
}

function buildFetcherConfigurations() {
  const proxyEnv = resolveProxyEnv();
  const proxyEnabled = Boolean(
    proxyEnv.explicitProxyUrl || (proxyEnv.useEnvProxy && proxyEnv.hasStandardProxyEnv),
  );
  const base = {
    keepAliveTimeout: 30_000,
    keepAliveTimeoutThreshold: 30_000,
    connections: proxyEnabled ? 1 : 128,
    pipelining: proxyEnabled ? 1 : 2,
  };

  if (proxyEnv.explicitProxyUrl) {
    return {
      ...base,
      factory: (_origin, opts) =>
        new ProxyAgent({
          ...opts,
          uri: proxyEnv.explicitProxyUrl,
          ...(proxyEnv.explicitProxyAuthToken ? { token: proxyEnv.explicitProxyAuthToken } : {}),
        }),
    };
  }

  if (proxyEnv.useEnvProxy && proxyEnv.hasStandardProxyEnv) {
    return {
      ...base,
      factory: () =>
        new EnvHttpProxyAgent({
          httpProxy: proxyEnv.httpProxy || undefined,
          httpsProxy: proxyEnv.httpsProxy || undefined,
          noProxy: proxyEnv.noProxy || undefined,
        }),
    };
  }

  return base;
}

function isProxyModeEnabled() {
  const proxyEnv = resolveProxyEnv();
  return Boolean(proxyEnv.explicitProxyUrl || (proxyEnv.useEnvProxy && proxyEnv.hasStandardProxyEnv));
}

function normalizeUrlForProxy(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol === "https:" && !parsed.port) {
      parsed.port = "443";
      return parsed.toString();
    }
    if (parsed.protocol === "http:" && !parsed.port) {
      parsed.port = "80";
      return parsed.toString();
    }
    return rawUrl;
  } catch {
    return rawUrl;
  }
}

class CurlProxyJSONRpcProvider extends JSONRpcProvider {
  #proxyEnv;
  #curlProxyUrl;

  constructor(config, proxyEnv) {
    super(config);
    this.#proxyEnv = proxyEnv;
    this.#curlProxyUrl = resolveCurlProxyUrl(proxyEnv);
  }

  async _send(payload) {
    const body = JSON.stringify(payload);
    const statusMarker = "__HEPTAD_CURL_HTTP_STATUS__:";
    const args = [
      "--silent",
      "--show-error",
      "--request",
      "POST",
      "--max-time",
      String(Math.max(1, Math.ceil((this.timeout ?? 20_000) / 1000))),
      "--header",
      "Content-Type: application/json",
      "--header",
      "User-Agent: OPNET/1.0",
      "--header",
      "Accept: application/json",
      "--write-out",
      `\n${statusMarker}%{http_code}`,
      "--data",
      body,
      this.url,
    ];

    if (this.#curlProxyUrl) {
      args.unshift(this.#curlProxyUrl);
      args.unshift("--proxy");
    }
    if (this.#proxyEnv.explicitProxyAuthToken) {
      args.unshift(`Proxy-Authorization: ${this.#proxyEnv.explicitProxyAuthToken}`);
      args.unshift("--proxy-header");
    }

    const { stdout, stderr } = await execFileAsync("curl", args, {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
      env: buildCurlEnv(this.#proxyEnv),
    });

    const markerIndex = stdout.lastIndexOf(statusMarker);
    if (markerIndex === -1) {
      throw new Error(`curl JSON-RPC response missing status marker. stderr=${stderr || "<empty>"}`);
    }
    const responseBody = stdout.slice(0, markerIndex).trim();
    const statusCodeRaw = stdout.slice(markerIndex + statusMarker.length).trim();
    const statusCode = Number.parseInt(statusCodeRaw, 10);
    if (!Number.isFinite(statusCode)) {
      throw new Error(`curl JSON-RPC response had invalid status code marker: ${statusCodeRaw}`);
    }
    if (statusCode < 200 || statusCode >= 300) {
      throw new Error(
        `curl JSON-RPC HTTP ${statusCode}. body=${responseBody || "<empty>"} stderr=${stderr || "<empty>"}`,
      );
    }
    if (!responseBody) {
      throw new Error(`curl JSON-RPC returned empty body with HTTP ${statusCode}. stderr=${stderr || "<empty>"}`);
    }

    const parsed = JSON.parse(responseBody);
    return Array.isArray(parsed) ? parsed : [parsed];
  }
}

export function createOpnetJsonRpcProvider({ url, network, timeout }) {
  const proxyEnv = resolveProxyEnv();
  const proxyModeEnabled = Boolean(proxyEnv.explicitProxyUrl || (proxyEnv.useEnvProxy && proxyEnv.hasStandardProxyEnv));
  // Only normalize explicit ports when proxy mode is enabled (proxy stacks may require it).
  // In direct mode, keep the original URL to avoid origin routing differences (e.g. Host with :443).
  const providerUrl = proxyModeEnabled ? normalizeUrlForProxy(url) : url;
  const config = {
    url: providerUrl,
    network,
    ...(typeof timeout === "number" ? { timeout } : {}),
    fetcherConfigurations: buildFetcherConfigurations(),
  };
  if (proxyModeEnabled) {
    return new CurlProxyJSONRpcProvider(config, proxyEnv);
  }
  return new JSONRpcProvider(config);
}

export function describeOpnetRpcTransport() {
  const proxyEnv = resolveProxyEnv();
  if (proxyEnv.explicitProxyUrl) {
    return `proxy(explicit:${redactProxyUrlForLog(proxyEnv.explicitProxyUrl)}${proxyEnv.explicitProxyAuthToken ? ",auth-token" : ""},curl)`;
  }
  if (proxyEnv.useEnvProxy && proxyEnv.hasStandardProxyEnv) {
    const proxy = proxyEnv.httpsProxy || proxyEnv.httpProxy;
    return `proxy(env:${redactProxyUrlForLog(proxy)},curl)`;
  }
  if (!proxyEnv.useEnvProxy && proxyEnv.hasStandardProxyEnv) {
    return "direct (OPNET_RPC_USE_ENV_PROXY=false)";
  }
  return "direct";
}
