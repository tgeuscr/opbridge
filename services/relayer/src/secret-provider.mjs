import fs from 'node:fs/promises';
import process from 'node:process';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

function parseSecretRef(raw) {
  const value = String(raw ?? '').trim();
  const match = /^(aws-sm|aws-ssm|file):\/\/([^#]+?)(?:#(.+))?$/.exec(value);
  if (!match) {
    throw new Error(
      `Unsupported secret ref "${value}". Expected aws-sm://..., aws-ssm://..., or file://...`,
    );
  }

  return {
    scheme: match[1],
    resource: decodeURIComponent(match[2]),
    selector: match[3] ? decodeURIComponent(match[3]) : '',
  };
}

function readSelectorPath(root, selector) {
  if (!selector) return root;
  return selector.split('.').reduce((value, segment) => {
    if (value == null) return undefined;
    if (Array.isArray(value) && /^\d+$/.test(segment)) {
      return value[Number(segment)];
    }
    if (typeof value === 'object') {
      return value[segment];
    }
    return undefined;
  }, root);
}

function extractSelectedValue(rawSecret, selector, ref) {
  if (!selector) return rawSecret;

  let parsed;
  try {
    parsed = JSON.parse(rawSecret);
  } catch (error) {
    throw new Error(
      `Secret ${ref} requires JSON content to use selector "${selector}": ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  const selected = readSelectorPath(parsed, selector);
  if (selected == null) {
    throw new Error(`Selector "${selector}" was not found in secret ${ref}.`);
  }
  return typeof selected === 'string' ? selected : JSON.stringify(selected);
}

async function runAwsCli(args) {
  try {
    const { stdout } = await execFileAsync('aws', args, {
      env: process.env,
      maxBuffer: 1024 * 1024,
    });
    return stdout.trim();
  } catch (error) {
    const message =
      error instanceof Error && 'stderr' in error && typeof error.stderr === 'string'
        ? error.stderr.trim() || error.message
        : error instanceof Error
          ? error.message
          : String(error);
    throw new Error(`AWS CLI secret fetch failed: ${message}`);
  }
}

export async function loadSecretString(ref) {
  const parsed = parseSecretRef(ref);
  let rawSecret = '';

  if (parsed.scheme === 'file') {
    rawSecret = (await fs.readFile(parsed.resource, 'utf8')).trim();
  } else if (parsed.scheme === 'aws-sm') {
    rawSecret = await runAwsCli([
      'secretsmanager',
      'get-secret-value',
      '--secret-id',
      parsed.resource,
      '--query',
      'SecretString',
      '--output',
      'text',
    ]);
  } else if (parsed.scheme === 'aws-ssm') {
    rawSecret = await runAwsCli([
      'ssm',
      'get-parameter',
      '--name',
      parsed.resource,
      '--with-decryption',
      '--query',
      'Parameter.Value',
      '--output',
      'text',
    ]);
  }

  return extractSelectedValue(rawSecret, parsed.selector, ref);
}

export async function loadJsonSecretPayload({
  directJson,
  secretRef,
  filePath,
  csv,
  csvField,
}) {
  if (directJson?.trim()) {
    return JSON.parse(directJson);
  }

  if (secretRef?.trim()) {
    return JSON.parse(await loadSecretString(secretRef));
  }

  if (filePath?.trim()) {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  }

  if (csv?.trim()) {
    return {
      [csvField]: csv
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean),
    };
  }

  return null;
}

export async function resolveSecretBackedValue({
  directValue,
  secretRef,
  trim = true,
}) {
  if (typeof directValue === 'string' && directValue.trim()) {
    return trim ? directValue.trim() : directValue;
  }

  if (typeof secretRef === 'string' && secretRef.trim()) {
    const loaded = await loadSecretString(secretRef.trim());
    return trim ? loaded.trim() : loaded;
  }

  return '';
}
