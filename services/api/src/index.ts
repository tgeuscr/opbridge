export interface SignatureBundleRecord {
  payloadHashHex: string;
  relayIndexes: number[];
  signaturesHex: string[];
  threshold: number;
}

export interface ApiRuntime {
  upsertSignatureBundle: (bundle: SignatureBundleRecord) => void;
  getSignatureBundle: (payloadHashHex: string) => SignatureBundleRecord | null;
  health: () => { ok: true; bundles: number };
}

export const startApi = (): ApiRuntime => {
  const bundles = new Map<string, SignatureBundleRecord>();

  return {
    upsertSignatureBundle: (bundle) => {
      bundles.set(bundle.payloadHashHex.toLowerCase(), bundle);
    },
    getSignatureBundle: (payloadHashHex) => {
      return bundles.get(payloadHashHex.toLowerCase()) ?? null;
    },
    health: () => ({ ok: true, bundles: bundles.size }),
  };
};
