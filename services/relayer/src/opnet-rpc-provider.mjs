import { JSONRpcProvider } from "opnet";

export function createOpnetJsonRpcProvider({ url, network, timeout }) {
  return new JSONRpcProvider({
    url,
    network,
    ...(typeof timeout === "number" ? { timeout } : {}),
  });
}

export function describeOpnetRpcTransport() {
  return "direct";
}
