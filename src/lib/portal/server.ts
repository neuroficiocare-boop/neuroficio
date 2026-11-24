import 'server-only';
import { cookies } from 'next/headers';
import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { PortalError } from './validation';
import { verifierStorage } from './pkce-storage';
import { portalConfigurationReady } from './configuration';

export function configured() {
  return portalConfigurationReady({ CARE_PORTAL_ENABLED: process.env.CARE_PORTAL_ENABLED, SUPABASE_URL: process.env.SUPABASE_URL, SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY });
}
export function emailMode(): 'link' | 'code' { return process.env.SUPABASE_EMAIL_MODE === 'code' ? 'code' : 'link'; }
export async function pkceClient() {
  if (!configured()) throw new PortalError('The secure care service is not connected yet.', 503);
  const store = await cookies();
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, { auth: {
    flowType: 'pkce', persistSession: true, autoRefreshToken: false, detectSessionInUrl: false, storageKey: 'nf-auth',
    storage: verifierStorage({ read: key => store.get(key)?.value, write: (key, value, options) => { store.set(key, value, options); } }, process.env.NODE_ENV === 'production'),
  } });
}
export function client() {
  if (!configured()) throw new PortalError('The secure care service is not connected yet. Please contact your care team.', 503);
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}
export async function saveSession(session: Session) {
  const store = await cookies();
  const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/api/portal', maxAge: 60 * 60 * 24 * 7 };
  store.set('nf-access', session.access_token, options);
  store.set('nf-refresh', session.refresh_token, options);
}
export async function clearSession() {
  const store = await cookies();
  for (const name of ['nf-access', 'nf-refresh', 'nf-password-setup']) store.set(name, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/api/portal', maxAge: 0 });
  for (const cookie of store.getAll()) if (cookie.name.startsWith('nf-pkce-')) store.set(cookie.name, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/api/portal', maxAge: 0 });
}
export async function authenticated() {
  const db = client();
  const store = await cookies();
  const access_token = store.get('nf-access')?.value;
  const refresh_token = store.get('nf-refresh')?.value;
  if (!access_token || !refresh_token) throw new PortalError('Please sign in to your care account.', 401);
  const { data: sessionData, error: sessionError } = await db.auth.setSession({ access_token, refresh_token });
  if (sessionError || !sessionData.session) { await clearSession(); throw new PortalError('Your session has expired. Please sign in again.', 401); }
  const { data, error } = await db.auth.getUser();
  if (error || !data.user || !data.user.email_confirmed_at) { await clearSession(); throw new PortalError('Please verify your email and sign in again.', 401); }
  if (sessionData.session.access_token !== access_token) await saveSession(sessionData.session);
  return { db, user: data.user };
}
export async function passwordSetupPending() { return Boolean((await cookies()).get('nf-password-setup')?.value); }
export async function markPasswordSetup(pending: boolean) {
  (await cookies()).set('nf-password-setup', pending ? '1' : '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/api/portal', maxAge: pending ? 900 : 0 });
}
export async function identity(db: SupabaseClient) {
  if (await passwordSetupPending()) throw new PortalError('Finish setting your password before opening care records.', 403);
  const { data, error } = await db.from('care_memberships').select('role, clinic_id').maybeSingle();
  if (error) throw new PortalError('Care account permissions could not be loaded.', 503);
  if (data) {
    const required = checked(await db.rpc('care_staff_mfa_required'));
    const { data: assurance, error: mfaError } = await db.auth.mfa.getAuthenticatorAssuranceLevel();
    if (required && (mfaError || assurance?.currentLevel !== 'aal2')) throw new PortalError('Complete staff verification to open clinical records.', 403);
    return data as { role: 'lead' | 'clinician'; clinic_id: string };
  }
  return { role: 'patient' as const, clinic_id: '' };
}
export function checked<T>({ data, error }: { data: T; error: unknown }): T {
  if (error) throw new PortalError('The record could not be saved or loaded. Check your access and try again.', 400);
  return data;
}
export function failure(error: unknown) {
  const known = error instanceof PortalError;
  return Response.json({ error: known ? error.message : 'The care service is temporarily unavailable. Please try again.' }, { status: known ? error.status : 500, headers: { 'Cache-Control': 'no-store' } });
}
export function json(data: unknown) { return Response.json(data, { headers: { 'Cache-Control': 'private, no-store', 'Vary': 'Cookie' } }); }
