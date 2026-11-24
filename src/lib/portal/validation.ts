export class PortalError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export function text(value: unknown, label: string, max = 3000, optional = false): string {
  if (optional && (value === undefined || value === null || value === '')) return '';
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new PortalError(`${label} must contain between 1 and ${max} characters.`);
  return value.trim();
}
export function uuid(value: unknown): string {
  const result = text(value, 'Record ID', 36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(result)) throw new PortalError('Invalid record ID.');
  return result;
}
export function email(value: unknown): string {
  const result = text(value, 'Email', 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) throw new PortalError('Enter a valid email address.');
  return result;
}
export function day(value: unknown): string {
  const result = text(value, 'Date', 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result) || !Number.isFinite(Date.parse(result)) || new Date(result).toISOString().slice(0, 10) !== result) throw new PortalError('Enter a valid date.');
  return result;
}
export function number(value: unknown, label: string, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new PortalError(`${label} must be between ${min} and ${max}.`);
  return value;
}
export function completed(value: unknown, activityIds: string[]): string[] {
  if (!Array.isArray(value) || value.length > activityIds.length || value.some(id => typeof id !== 'string' || !activityIds.includes(id)) || new Set(value).size !== value.length) throw new PortalError('Choose activities from the current care plan.');
  return value;
}
export function sameOrigin(request: Request): void {
  if (request.headers.get('origin') !== new URL(request.url).origin) throw new PortalError('This request must originate from the care portal.', 403);
}

export function password(value: unknown, creating = false): string {
  if (typeof value !== 'string' || value.length < (creating ? 12 : 1) || value.length > 128 || (creating && !value.trim())) throw new PortalError(creating ? 'Choose a password between 12 and 128 characters.' : 'Enter your password.');
  return value;
}
