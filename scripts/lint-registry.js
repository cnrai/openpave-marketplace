#!/usr/bin/env node
/**
 * lint-registry.js — schema lint for registry.yaml
 * (cnrai/openpave#2638, lane 4: the requiresMcps composite field).
 *
 * Validates the cnrai-curated skills registry:
 *   - top-level `skills` map exists (entries may be zero)
 *   - ids match ^[a-z0-9][a-z0-9-]*$ (lowercase kebab)
 *   - REQUIRED per skill: name, version (semver-ish), repository (the
 *     cnrai/<something> GitHub shorthand the installer clones)
 *   - name/version/description/author/category are strings when present
 *   - keywords/tags are string arrays when present
 *   - NEW (#2638 R13): `requiresMcps` is an OPTIONAL string array of MCP
 *     capability ids (the bare ids in cnrai/openpave-capabilities' mcps map);
 *     each entry must match the MCP id charset ^[a-z0-9][a-z0-9-]*$. A skill
 *     may not require the same MCP twice.
 *
 * Exit 0 = clean; exit 1 = findings printed.
 */

'use strict';

const fs = require('fs');
const path = require('path');

let yaml;
try {
  yaml = require('js-yaml');
} catch (e) {
  console.error('lint-registry: js-yaml is required (npm install)');
  process.exit(1);
}

const FILE = process.argv[2] || path.join(__dirname, '..', 'registry.yaml');
const findings = [];

function fail(msg) { findings.push(msg); }

function isKebab(s) {
  return typeof s === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(s);
}

const doc = (() => {
  try {
    return yaml.load(fs.readFileSync(FILE, 'utf8'));
  } catch (e) {
    fail('registry.yaml is not parseable YAML: ' + e.message);
    return null;
  }
})();

if (doc) {
  if (!doc.skills || typeof doc.skills !== 'object' || Array.isArray(doc.skills)) {
    fail('top-level `skills` map is missing');
  } else {
    const ids = Object.keys(doc.skills);
    if (ids.length === 0) {
      console.log('lint-registry: the skills map is empty (seed state)');
    }
    for (const id of ids) {
      const entry = doc.skills[id];
      if (!isKebab(id)) fail('skill id "' + id + '" must be lowercase kebab ([a-z0-9][a-z0-9-]*)');
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        fail('skill "' + id + '": entry must be a mapping');
        continue;
      }
      for (const field of ['name', 'version', 'repository']) {
        if (typeof entry[field] !== 'string' || !entry[field]) {
          fail('skill "' + id + '": ' + field + ' is required');
        }
      }
      if (typeof entry.version === 'string' && !/^\d+\.\d+\.\d+/.test(entry.version)) {
        fail('skill "' + id + '": version "' + entry.version + '" must be semver-ish (e.g. 1.0.0)');
      }
      if (typeof entry.repository === 'string' && entry.repository
        && !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(entry.repository)) {
        fail('skill "' + id + '": repository must be an owner/repo GitHub shorthand');
      }
      for (const field of ['description', 'author', 'category', 'icon']) {
        if (entry[field] !== undefined && entry[field] !== null && typeof entry[field] !== 'string') {
          fail('skill "' + id + '": ' + field + ' must be a string when present');
        }
      }
      if (entry.keywords !== undefined && !Array.isArray(entry.keywords)) {
        fail('skill "' + id + '": keywords must be an array when present');
      }
      // #2638 R13: the composite dependency field.
      if (entry.requiresMcps !== undefined) {
        if (!Array.isArray(entry.requiresMcps)) {
          fail('skill "' + id + '": requiresMcps must be an array of MCP capability ids');
        } else {
          const seen = new Set();
          for (const mcpId of entry.requiresMcps) {
            if (!isKebab(mcpId)) {
              fail('skill "' + id + '": requiresMcps entry "' + mcpId + '" must be a lowercase kebab MCP id (the bare id in cnrai/openpave-capabilities)');
            }
            if (seen.has(mcpId)) fail('skill "' + id + '": requiresMcps lists "' + mcpId + '" twice');
            seen.add(mcpId);
          }
        }
      }
    }
  }
}

if (findings.length) {
  console.error('lint-registry: ' + findings.length + ' finding(s):');
  for (const f of findings) console.error('  - ' + f);
  process.exit(1);
}
console.log('lint-registry: OK');
