import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/portal/validation.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
const v = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('Reject malformed dates and preserve leap-year dates', () => {
  assert.equal(v.day('2028-02-29'), '2028-02-29');
  for (const value of ['2026-02-29', '2026-02-30', '2026-13-01', '', null]) assert.throws(() => v.day(value));
});
test('Do not coerce absent or non-finite clinical measurements', () => {
  for (const value of [NaN, Infinity, '4', null, -1, 11]) assert.throws(() => v.number(value, 'Pain', 0, 10));
  assert.equal(v.number(0, 'Pain', 0, 10), 0);
});
test('Completion accepts only unique activities prescribed in the current plan', () => {
  assert.deepEqual(v.completed([], ['a']), []);
  assert.deepEqual(v.completed(['a'], ['a']), ['a']);
  for (const value of [['a', 'a'], ['b'], [null], {}, null]) assert.throws(() => v.completed(value, ['a']));
});
test('Mutations require a matching Origin, including scheme and port', () => {
  const request = origin => new Request('https://neuroficio.test/api/portal/data', { headers: origin ? { Origin: origin } : {} });
  v.sameOrigin(request('https://neuroficio.test'));
  for (const origin of ['https://attacker.test', 'http://neuroficio.test', 'https://neuroficio.test:444', null]) assert.throws(() => v.sameOrigin(request(origin)));
});

const storageSource = await readFile(new URL('../src/lib/portal/pkce-storage.ts', import.meta.url), 'utf8');
const storageCode = ts.transpileModule(storageSource, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { verifierStorage } = await import(`data:text/javascript;base64,${Buffer.from(storageCode).toString('base64')}`);

test('PKCE cookie storage persists only short-lived, HttpOnly verification state', () => {
  const cookies = new Map();
  const writes = [];
  const adapter = () => verifierStorage({ read: key => cookies.get(key), write: (key, value, options) => { cookies.set(key, value); writes.push({ key, value, options }); } }, true);
  const first = adapter();
  first.setItem('nf-auth-code-verifier', 'browser-bound-secret');
  first.setItem('nf-auth', 'session-access-and-refresh-tokens');
  const second = adapter();
  assert.equal(second.getItem('nf-auth-code-verifier'), 'browser-bound-secret');
  assert.equal(second.getItem('nf-auth'), null);
  assert.equal(writes.length, 1);
  assert.deepEqual(writes[0].options, { httpOnly: true, secure: true, sameSite: 'lax', path: '/api/portal', maxAge: 900 });
  second.removeItem('nf-auth-code-verifier');
  assert.equal(writes.at(-1).options.maxAge, 0);
});

test('Independent PKCE flow slots do not overwrite one another', () => {
  const cookies = new Map();
  const adapter = verifierStorage({ read: key => cookies.get(key), write: (key, value) => cookies.set(key, value) }, false);
  adapter.setItem('nf-auth-flow-aaaa-code-verifier', 'first');
  adapter.setItem('nf-auth-flow-bbbb-code-verifier', 'second');
  assert.equal(adapter.getItem('nf-auth-flow-aaaa-code-verifier'), 'first');
  assert.equal(adapter.getItem('nf-auth-flow-bbbb-code-verifier'), 'second');
  assert.throws(() => adapter.setItem('nf-auth-code-verifier', 'x'.repeat(3001)));
});

test('Refreshing example wording preserves patient records and user-entered changes', async () => {
  const source = await readFile(new URL('../src/lib/portal/demo.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
  const { demoData, refreshExampleWording } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
  const original = demoData();
  original.checkins[0].comment = 'A reviewer-entered note that must be retained.';
  original.reports[0].snapshot.author = 'Demonstration clinician · fictional report';
  const updated = refreshExampleWording(original);
  assert.deepEqual(updated.patients, original.patients);
  assert.deepEqual(updated.observations, original.observations);
  assert.equal(updated.checkins[0].comment, original.checkins[0].comment);
  assert.equal(updated.reports[0].snapshot.author, 'NeuroFicio care team');
  assert.equal(original.reports[0].snapshot.author, 'Demonstration clinician · fictional report');
});

test('Unfinished connection settings cannot enable email access', async () => {
  const source = await readFile(new URL('../src/lib/portal/configuration.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
  const { portalConfigurationReady } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
  const settings = { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_ANON_KEY: 'public-key' };
  assert.equal(portalConfigurationReady(settings), false);
  assert.equal(portalConfigurationReady({ ...settings, CARE_PORTAL_ENABLED: 'false' }), false);
  assert.equal(portalConfigurationReady({ ...settings, CARE_PORTAL_ENABLED: 'true' }), true);
  assert.equal(portalConfigurationReady({ CARE_PORTAL_ENABLED: 'true' }), false);
});
