import LZString from 'lz-string';
import { Answers, SharedPayload } from '@/types/quiz';

const PAYLOAD_VERSION = 1;

/**
 * Encode answers into a compact URL-safe string using LZ compression.
 */
export function encodeAnswers(answers: Answers): string {
  const payload: SharedPayload = {
    v: PAYLOAD_VERSION,
    a: answers,
  };
  const json = JSON.stringify(payload);
  return LZString.compressToEncodedURIComponent(json);
}

/**
 * Decode the compressed payload back into answers.
 * Returns null if the payload is malformed or from an incompatible version.
 */
export function decodeAnswers(encoded: string): Answers | null {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (!decompressed) return null;

    const payload: SharedPayload = JSON.parse(decompressed);

    if (!payload || typeof payload !== 'object') return null;
    if (payload.v !== PAYLOAD_VERSION) return null;
    if (!payload.a || typeof payload.a !== 'object') return null;

    return payload.a;
  } catch {
    return null;
  }
}

/**
 * Generate a shareable URL with the creator's answers encoded in the hash fragment.
 * Hash fragments are NOT sent to the server, so answers stay client-side.
 */
export function generateShareLink(answers: Answers): string {
  const encoded = encodeAnswers(answers);
  const base =
    typeof window !== 'undefined'
      ? `${window.location.origin}/play`
      : '/play';
  return `${base}#data=${encoded}`;
}

/**
 * Extract the encoded payload from the current URL hash fragment.
 */
export function getPayloadFromHash(): string | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  if (!hash || !hash.startsWith('#data=')) return null;
  return hash.slice('#data='.length);
}

/**
 * Copy text to clipboard, falling back gracefully.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

/**
 * Use Web Share API if available, otherwise copy link.
 */
export async function shareResult(
  url: string,
  score: number
): Promise<'shared' | 'copied' | 'failed'> {
  const title = 'Us, Apparently 💘';
  const text = `We got ${score}% compatibility on this quiz. Find out if we'd get along 👀`;

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch {
      // User dismissed share sheet
    }
  }

  const copied = await copyToClipboard(url);
  return copied ? 'copied' : 'failed';
}
