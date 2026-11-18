import { authenticated, checked, clearSession, client, failure, json, saveSession } from '@/lib/portal/server';
import { email, PortalError, sameOrigin, text, uuid } from '@/lib/portal/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { db, user } = await authenticated();
    const membership = checked(await db.from('care_memberships').select('role').maybeSingle());
    const { data: assurance } = await db.auth.mfa.getAuthenticatorAssuranceLevel();
    const { data: factors, error } = await db.auth.mfa.listFactors();
    if (error) throw new PortalError('Staff verification could not be loaded. Try signing in again.');
    return json({ email: user.email, staff: Boolean(membership), verified: assurance?.currentLevel === 'aal2', factors: factors?.totp.filter(f => f.status === 'verified').map(f => ({ id: f.id, name: f.friendly_name })) ?? [] });
  } catch (error) { return failure(error); }
}

export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const raw = await request.text();
    if (raw.length > 12000) throw new PortalError('Request is too large.', 413);
    const body = JSON.parse(raw);
    if (body.action === 'logout') {
      try { const { db } = await authenticated(); await db.auth.signOut({ scope: 'local' }); } finally { await clearSession(); }
      return json({ ok: true });
    }
    if (body.action === 'send-code') {
      const address = email(body.email);
      const { error } = await client().auth.signInWithOtp({ email: address, options: { shouldCreateUser: false } });
      // Do not disclose whether an email has a care account. Provider rate limits apply.
      if (error?.status === 429) throw new PortalError('Please wait before requesting another code.', 429);
      return json({ message: 'If this email has an active care account, a sign-in code will arrive shortly.' });
    }
    if (body.action === 'verify-code') {
      const token = text(body.code, 'Verification code', 10);
      if (!/^\d{6,10}$/.test(token)) throw new PortalError('Enter the numeric code from your email.');
      const { data, error } = await client().auth.verifyOtp({ email: email(body.email), token, type: body.invitation === true ? 'invite' : 'email' });
      if (error || !data.session) throw new PortalError('This code is invalid or has expired. Request another code.');
      await saveSession(data.session);
      return json({ ok: true });
    }
    const { db } = await authenticated();
    if (body.action === 'enroll-mfa') {
      const { data: factors } = await db.auth.mfa.listFactors();
      if (factors?.totp.some(f => f.status === 'verified')) throw new PortalError('Use your existing authenticator to verify your account.');
      for (const factor of factors?.all.filter(f => f.status === 'unverified') ?? []) await db.auth.mfa.unenroll({ factorId: factor.id });
      const { data, error } = await db.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'NeuroFicio Care' });
      if (error || !data) throw new PortalError('Authenticator setup failed. Please try again.');
      return json({ id: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
    }
    if (body.action === 'verify-mfa') {
      const factorId = uuid(body.factor_id);
      const code = text(body.code, 'Authenticator code', 6);
      if (!/^\d{6}$/.test(code)) throw new PortalError('Enter the six-digit authenticator code.');
      const { data, error } = await db.auth.mfa.challengeAndVerify({ factorId, code });
      if (error || !data) throw new PortalError('Authenticator code could not be verified. Try the current code.');
      const { data: session } = await db.auth.getSession();
      if (!session.session) throw new PortalError('Please sign in again.', 401);
      await saveSession(session.session);
      return json({ ok: true });
    }
    throw new PortalError('Unknown account action.');
  } catch (error) { return failure(error); }
}
