export function portalConfigurationReady(env: {
  CARE_PORTAL_ENABLED?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}): boolean {
  return env.CARE_PORTAL_ENABLED === 'true' && Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
}
