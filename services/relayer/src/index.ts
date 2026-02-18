export interface RelayObservation {
  source: 'ethereum' | 'opnet';
  eventId: string;
  payloadHash: string;
}

export const startRelayer = (): void => {
  // TODO: wire chain listeners and signer modules.
};
