import { authenticated, checked, clearSession, client, emailMode, failure, json, pkceClient, saveSession } from '@/lib/portal/server';
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
      const mode = emailMode();
      const db = mode === 'link' ? await pkceClient() : client();
      const { error } = await db.auth.signInWithOtp({ email: address, options: { shouldCreateUser: false, ...(mode === 'link' ? { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.neuroficio.com'}/portal` } : {}) } });
      // Do not disclose whether an email has a care account. Provider rate limits apply.
      if (error?.status === 429) throw new PortalError('Please wait before requesting another code.', 429);
      if (error && error.status !== 400 && error.status !== 422) throw new PortalError('Email delivery is temporarily unavailable. Please contact your care team.', 503);
      return json({ message: mode === 'link' ? 'If this email has an active care account, a sign-in link will arrive shortly. Open it in this same browser within 15 minutes.' : 'If this email has an active care account, a sign-in code will arrive shortly.' });
    }
    if (body.action === 'exchange-link') {
      const db = await pkceClient();
      const code = text(body.code, 'Sign-in code', 2048);
      const flowId = typeof body.flow_id === 'string' && /^[a-f0-9]{16,64}$/.test(body.flow_id) ? body.flow_id : undefined;
      const { data, error } = await db.auth.exchangeCodeForSession(code, flowId ? { flowId } : undefined);
      if (error || !data.session) throw new PortalError('This sign-in link is expired or belongs to another browser. Request a new link and open it in the browser that requested it.');
      const { data: verified, error: verifyError } = await db.auth.getUser();
      if (verifyError || !verified.user?.email_confirmed_at) throw new PortalError('Email verification could not be confirmed. Please request a new link.');
      await saveSession(data.session);
      return json({ ok: true });
    }
    if (body.action === 'accept-invitation-link') {
      const expectedEmail = email(body.email);
      const db = client();
      const { data, error } = await db.auth.setSession({ access_token: text(body.access_token, 'Invitation', 6000), refresh_token: text(body.refresh_token, 'Invitation', 1000) });
      if (error || !data.session) throw new PortalError('This invitation link has expired. Contact your care team for another invitation.');
      const { data: verified, error: verifyError } = await db.auth.getUser();
      if (verifyError || !verified.user?.email_confirmed_at || !verified.user.invited_at || verified.user.email?.toLowerCase() !== expectedEmail) throw new PortalError('The email address does not match this verified invitation.');
      await saveSession(data.session);
      return json({ ok: true });
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
