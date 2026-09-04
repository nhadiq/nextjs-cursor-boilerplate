#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function flattenKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return flattenKeys(value, next);
    }
    return [next];
  });
}

const enPath = 'messages/en.json';
const arPath = 'messages/ar.json';

if (!existsSync(enPath) || !existsSync(arPath)) {
  console.error('Missing messages/en.json or messages/ar.json');
  process.exit(1);
}

const enKeys = new Set(flattenKeys(loadJson(enPath)));
const arKeys = new Set(flattenKeys(loadJson(arPath)));

const missingInAr = [...enKeys].filter((key) => !arKeys.has(key));
const missingInEn = [...arKeys].filter((key) => !enKeys.has(key));

if (missingInAr.length || missingInEn.length) {
  if (missingInAr.length) {
    console.error('Keys missing in ar.json:', missingInAr.join(', '));
  }
  if (missingInEn.length) {
    console.error('Keys missing in en.json:', missingInEn.join(', '));
  }
  process.exit(1);
}

console.log(`i18n check passed (${enKeys.size} keys)`);
