import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const compile = source => ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const moduleUrl = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const validation = await import(moduleUrl(compile(await readFile(new URL('../src/lib/portal/validation.ts', import.meta.url), 'utf8'))));
let saved, pending, updated, signedIn, recoveryError, loginError, updateError;
const user = { email: 'member@example.test', email_confirmed_at: '2026-11-24', invited_at: '2026-11-24' };
const session = { access_token: 'test-access', refresh_token: 'test-refresh' };
const db = { auth: {
  signInWithPassword: async input => { signedIn = input; return { data: { session, user }, error: loginError }; },
  resetPasswordForEmail: async () => ({ error: recoveryError }),
  exchangeCodeForSession: async () => ({ data: { session }, error: null }),
  getUser: async () => ({ data: { user }, error: null }),
  setSession: async () => ({ data: { session }, error: null }),
  updateUser: async input => { updated = input; return { error: updateError }; },
  getSession: async () => ({ data: { session } }),
} };
globalThis.__portalAuthTest = { ...validation,
  client: () => db, pkceClient: async () => db, emailMode: () => 'link', authenticated: async () => ({ db, user }),
  checked: r => r.data, clearSession: async () => { saved = null; pending = false; },
  saveSession: async value => { saved = value; }, markPasswordSetup: async value => { pending = value; }, passwordSetupPending: async () => pending,
  json: data => Response.json(data), failure: error => Response.json({ error: error.message }, { status: error.status || 500 }),
};
let code = compile(await readFile(new URL('../src/app/api/portal/auth/route.ts', import.meta.url), 'utf8'));
code = code.replace(/import \{([^}]+)\} from [^;]+;/g, (_, names) => `const {${names}} = globalThis.__portalAuthTest;`);
const { POST } = await import(moduleUrl(code));
const post = body => POST(new Request('https://www.neuroficio.com/api/portal/auth', { method: 'POST', headers: { Origin: 'https://www.neuroficio.com' }, body: JSON.stringify(body) }));
test('Password authentication and verified setup', async t => {
 await t.test('passwords preserve spaces and enforce setup length', () => {
   assert.equal(validation.password('  a long password  ', true), '  a long password  ');
   for (const bad of ['short', ' '.repeat(12), 'x'.repeat(129), null]) assert.throws(() => validation.password(bad, true));
 });
 await t.test('invalid credentials never save a session and give a generic error', async () => {
   saved = null; loginError = { status: 400 }; const r = await post({ action: 'password-login', email: user.email, password: 'wrong' });
   assert.equal(r.status, 401); assert.equal(saved, null); assert.match((await r.json()).error, /Email or password is incorrect/); loginError = null;
 });
 await t.test('valid password login saves session without accepting a client-supplied role', async () => {
   pending = true; const r = await post({ action: 'password-login', email: user.email, password: '  valid password  ', role: 'lead' });
   assert.equal(r.status, 200); assert.equal(saved, session); assert.equal(pending, false);
   assert.deepEqual(signedIn, { email: user.email, password: '  valid password  ' });
 });
 await t.test('reset does not disclose account existence and honors rate limits', async () => {
   recoveryError = { status: 422 }; const r = await post({ action: 'request-password-reset', email: user.email });
   assert.equal(r.status, 200); assert.match((await r.json()).message, /^If this email/);
   recoveryError = { status: 429 }; assert.equal((await post({ action: 'request-password-reset', email: user.email })).status, 429); recoveryError = null;
 });
 await t.test('verified email link opens password setup before records', async () => {
   pending = false; const r = await post({ action: 'exchange-link', code: 'verified-link-code' });
   assert.equal(r.status, 200); assert.equal((await r.json()).passwordSetup, true); assert.equal(pending, true);
 });
 await t.test('failed password change preserves setup gate; success clears it', async () => {
   updateError = { message: 'unavailable' }; let r = await post({ action: 'set-password', password: 'a strong password' });
   assert.equal(r.status, 400); assert.equal(pending, true); updateError = null;
   r = await post({ action: 'set-password', password: 'a strong password' }); assert.equal(r.status, 200); assert.equal(pending, false); assert.deepEqual(updated, { password: 'a strong password' });
 });
 await t.test('invitation requires confirmed matching email before saving password', async () => {
   updated = null; let r = await post({ action: 'accept-invitation-link', email: 'other@example.test', password: 'a strong password', access_token: 'a', refresh_token: 'r' });
   assert.equal(r.status, 400); assert.equal(updated, null);
   r = await post({ action: 'accept-invitation-link', email: user.email, password: 'a strong password', access_token: 'a', refresh_token: 'r' }); assert.equal(r.status, 200); assert.deepEqual(updated, { password: 'a strong password' });
 });
 await t.test('cross-origin password requests are denied', async () => {
   const r = await POST(new Request('https://www.neuroficio.com/api/portal/auth', { method: 'POST', headers: { Origin: 'https://other.test' }, body: JSON.stringify({ action: 'password-login' }) })); assert.equal(r.status, 403);
 });
});
