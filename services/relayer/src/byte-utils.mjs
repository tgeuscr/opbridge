import { BufferHelper } from '@btc-vision/transaction';

export function bytesToHex(bytes) {
  return `0x${BufferHelper.toHex(bytes)}`;
}

export function hexToBytes(raw) {
  const value = String(raw ?? '').trim();
  const normalized = value.startsWith('0x') ? value.slice(2) : value;
  if (!/^[0-9a-fA-F]+$/.test(normalized) || normalized.length % 2 !== 0) {
    throw new Error(`Invalid hex string: ${raw}`);
  }
  return BufferHelper.fromHex(normalized);
}

export function concatBytes(parts) {
  const totalLength = parts.reduce((acc, part) => acc + part.length, 0);
  const out = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

export function base64ToBytes(raw) {
  const normalized = String(raw ?? '').trim();
  if (!normalized) {
    return new Uint8Array(0);
  }
  const binary = atob(normalized);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

export function bytesToBase64(bytes) {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}
