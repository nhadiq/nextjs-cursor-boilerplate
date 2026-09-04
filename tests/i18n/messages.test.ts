import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return flattenKeys(value as Record<string, unknown>, next);
    }
    return [next];
  });
}

describe('i18n messages', () => {
  it('has matching keys in en and ar', () => {
    const en = JSON.parse(readFileSync('messages/en.json', 'utf8'));
    const ar = JSON.parse(readFileSync('messages/ar.json', 'utf8'));
    expect(flattenKeys(en).sort()).toEqual(flattenKeys(ar).sort());
  });
});
