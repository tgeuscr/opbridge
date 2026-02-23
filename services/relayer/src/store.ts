import type { PendingAttestation } from './types';

export class InMemoryRelayStore {
  private readonly observed = new Set<string>();
  private readonly pending = new Map<string, PendingAttestation>();

  public markObserved(observationId: string): boolean {
    if (this.observed.has(observationId)) return false;
    this.observed.add(observationId);
    return true;
  }

  public upsertPending(attestation: PendingAttestation): void {
    this.pending.set(attestation.observationId, attestation);
  }

  public listPending(): PendingAttestation[] {
    return [...this.pending.values()];
  }

  public observationCount(): number {
    return this.observed.size;
  }
}
