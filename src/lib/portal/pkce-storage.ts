type CookieOptions = { httpOnly: boolean; secure: boolean; sameSite: 'lax'; path: string; maxAge: number };
type VerifierCookies = { read: (name: string) => string | undefined; write: (name: string, value: string, options: CookieOptions) => void };

// Only PKCE verifiers persist. SDK session data stays in request-local memory;
// verified sessions use the separate HttpOnly session cookies in server.ts.
export function verifierStorage(cookies: VerifierCookies, secure: boolean) {
  const memory = new Map<string, string>();
  const options: CookieOptions = { httpOnly: true, secure, sameSite: 'lax', path: '/api/portal', maxAge: 900 };
  const verifier = (key: string) => /^[a-zA-Z0-9-]{1,180}-code-verifier$/.test(key);
  return {
    getItem(key: string) { return verifier(key) ? cookies.read(`nf-pkce-${key}`) ?? null : memory.get(key) ?? null; },
    setItem(key: string, value: string) {
      if (verifier(key)) {
        if (value.length > 3000) throw new Error('Verification state is too large.');
        cookies.write(`nf-pkce-${key}`, value, options);
      } else memory.set(key, value);
    },
    removeItem(key: string) {
      if (verifier(key)) cookies.write(`nf-pkce-${key}`, '', { ...options, maxAge: 0 });
      else memory.delete(key);
    },
  };
}
