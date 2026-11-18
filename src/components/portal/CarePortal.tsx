'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Activity, ArrowRight, ArrowUpRight, CalendarDays, Check, CheckCircle2, ChevronRight, ClipboardList, FileText, Heart, LayoutDashboard, LogOut, Plus, Printer, RefreshCw, Search, ShieldCheck, Stethoscope, TrendingUp, Users } from 'lucide-react';
import { demoData } from '@/lib/portal/demo';
import type { Mutation, Observation, PortalData, Report, Tab } from '@/lib/portal/types';

const demoKey = 'neuroficio-fictional-demo-v2';
const today = () => new Date().toISOString().slice(0, 10);
const date = (value: string) => new Date(value.length === 10 ? `${value}T12:00:00Z` : value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const time = (value: string) => new Date(value).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
const tabs: { id: Tab; label: string; icon: typeof Heart }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard }, { id: 'patients', label: 'Patients', icon: Users },
  { id: 'plan', label: 'Care plan', icon: ClipboardList }, { id: 'checkin', label: 'Daily check-ins', icon: Heart },
  { id: 'progress', label: 'Progress', icon: TrendingUp }, { id: 'notes', label: 'Doctor updates', icon: FileText },
  { id: 'appointments', label: 'Appointments', icon: CalendarDays }, { id: 'reports', label: 'Progress reports', icon: FileText },
];

async function api(path: string, body?: object) {
  const response = await fetch(`/api/portal/${path}`, { method: body ? 'POST' : 'GET', cache: 'no-store', headers: body ? { 'Content-Type': 'application/json' } : {}, ...(body ? { body: JSON.stringify(body) } : {}) });
  const result = await response.json();
  if (!response.ok) throw new CareApiError(result.error || 'The care service could not complete this request.', response.status);
  return result;
}

class CareApiError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
}

function Empty({ title, children }: { title: string; children: ReactNode }) {
  return <div className="cp-empty"><ClipboardList size={28} /><h3>{title}</h3><p>{children}</p></div>;
}
function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="cp-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}
function ActionForm({ title, children, submit, busy, onSave }: { title: string; children: ReactNode; submit: string; busy: boolean; onSave: (fields: FormData) => Promise<boolean> }) {
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget;
    if (await onSave(new FormData(form))) form.reset();
  }
  return <section className="cp-card cp-editor"><h3>{title}</h3><form onSubmit={send}><fieldset disabled={busy}>{children}<button className="cp-button" type="submit">{busy ? 'Saving…' : submit}<ArrowRight size={16} /></button></fieldset></form></section>;
}
function MetricsChart({ observations }: { observations: Observation[] }) {
  const groups = new Map<string, Observation[]>();
  observations.forEach(o => { const key = `${o.label}|${o.unit}|${o.direction}`; groups.set(key, [...(groups.get(key) ?? []), o]); });
  if (!groups.size) return <Empty title="Your starting point comes first">Your clinician will record measurements at assessment. Progress appears here when those measurements are available.</Empty>;
  return <>{[...groups.entries()].map(([key, entries]) => {
    const rows = [...entries].sort((a, b) => a.measured_on.localeCompare(b.measured_on));
    const max = Math.max(...rows.map(r => Number(r.value)), 1) * 1.2;
    const points = rows.map((r, i) => ({ x: rows.length === 1 ? 300 : 35 + i * 530 / (rows.length - 1), y: 160 - Number(r.value) / max * 130, row: r }));
    const first = rows[0], last = rows[rows.length - 1];
    return <article className="cp-card cp-chart" key={key}><div className="cp-card-head"><div><span className="cp-kicker">Clinician-recorded measure</span><h3>{first.label}</h3></div><span className="cp-badge">{first.unit}</span></div>
      <div className="cp-chart-values"><strong>{last.value}<small> {last.unit}</small></strong><span>{rows.length > 1 ? `Baseline ${first.value} ${first.unit} · ${date(first.measured_on)}` : 'Baseline recorded · a later assessment will show change'}</span></div>
      <svg viewBox="0 0 600 195" role="img" aria-label={`${first.label}: ${rows.map(r => `${r.value} ${r.unit} on ${date(r.measured_on)}`).join(', ')}`}>
        {[30, 75, 120, 165].map(y => <line key={y} x1="25" x2="575" y1={y} y2={y} stroke="#e3e9e4" strokeDasharray="4 5" />)}
        <polyline points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#347a68" strokeWidth="3" strokeLinejoin="round" />
        {points.map(({ x, y, row }, i) => <g key={row.id}><circle cx={x} cy={y} r="5" fill="#347a68" stroke="white" strokeWidth="2" /><text x={x} y={Math.max(16, y - 13)} textAnchor="middle" fontSize="12" fill="#22483e">{row.value}</text>{(i === 0 || i === points.length - 1) && <text x={x} y="190" textAnchor="middle" fontSize="10" fill="#5e7069">{date(row.measured_on)}</text>}</g>)}
      </svg><p className="cp-muted">{first.direction === 'higher' ? 'Higher' : 'Lower'} values are the intended direction for this measure. Your clinician interprets changes in context.</p>
      <details><summary>View measurement history</summary><div className="cp-table-scroll"><table><thead><tr><th>Date</th><th>Measurement</th><th>Source</th></tr></thead><tbody>{rows.map(r => <tr key={r.id}><td>{date(r.measured_on)}</td><td>{r.value} {r.unit}</td><td>Clinician assessment</td></tr>)}</tbody></table></div></details>
    </article>;
  })}</>;
}

function ReportView({ report, demo }: { report: Report; demo: boolean }) {
  const s = report.snapshot;
  return <article className="cp-card cp-report"><div className="cp-card-head"><div><span className="cp-kicker">NeuroFicio · {demo ? 'Fictional demonstration' : 'Published care report'}</span><h3>{report.title}</h3></div><button className="cp-button cp-secondary cp-no-print" onClick={event => {
    document.querySelectorAll('.cp-report').forEach(node => node.classList.remove('cp-print-target'));
    event.currentTarget.closest('.cp-report')?.classList.add('cp-print-target');
    window.print();
  }}><Printer size={16} />Print / save PDF</button></div>
    <div className="cp-report-meta"><strong>{s.patient_name}</strong><span>{s.condition}</span><span>{date(s.period_start)} – {date(s.period_end)}</span></div>
    <h4>Clinical interpretation</h4><p className="cp-preserve">{report.summary}</p>
    <h4>Recorded measurements</h4>{s.observations.length ? <div className="cp-table-scroll"><table><thead><tr><th>Date</th><th>Measure</th><th>Value</th></tr></thead><tbody>{s.observations.map(o => <tr key={o.id}><td>{date(o.measured_on)}</td><td>{o.label}</td><td>{o.value} {o.unit}</td></tr>)}</tbody></table></div> : <p>No measurements recorded within this reporting period.</p>}
    <h4>Home-care participation</h4><p>{s.checkins.length} submitted check-in{s.checkins.length === 1 ? '' : 's'} in this period. Missing days have no recorded response. Activity completion reflects participation and does not establish health improvement.</p>
    {s.plan && <><h4>Care plan at the end of the reporting period</h4><p>{s.plan.title} · published {date(s.plan.created_at)}</p>{s.plan.goals.map((g, i) => <p key={i}><strong>{g.title}</strong><br />{g.target}</p>)}</>}
    <h4>Shared care updates</h4>{s.notes.length ? s.notes.map(n => <div key={n.id}><strong>{n.title} · {date(n.created_at)}</strong><p className="cp-preserve">{n.body}</p></div>) : <p>No shared updates within this reporting period.</p>}
    <h4>Next steps</h4><p className="cp-preserve">{report.next_steps}</p><footer>Reviewed and published by {s.author}<br />{date(report.created_at)} · Record {report.id}</footer>
  </article>;
}

type AuthStatus = { email: string; staff: boolean; verified: boolean; factors: { id: string; name?: string }[] };

export default function CarePortal({ connected, emailMode = 'link' }: { connected: boolean; emailMode?: 'link' | 'code' }) {
  const [data, setData] = useState<PortalData | null>(null);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(connected);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>('overview');
  const [selected, setSelected] = useState('');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [auth, setAuth] = useState<AuthStatus | null>(null);
  const [address, setAddress] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [invitation, setInvitation] = useState(false);
  const [inviteTokens, setInviteTokens] = useState<{ access_token: string; refresh_token: string } | null>(null);
  const [enrollment, setEnrollment] = useState<{ id: string; qr: string; secret: string } | null>(null);

  function enterDemo(role: 'patient' | 'lead') {
    let initial = demoData();
    try {
      const saved = JSON.parse(sessionStorage.getItem(demoKey) || 'null');
      if (saved?.patients?.[0]?.id === 'demo-asha' && Array.isArray(saved.plans) && Array.isArray(saved.reports)) initial = saved;
    } catch { /* A fresh fictional session remains available. */ }
    initial.role = role; initial.email = role === 'patient' ? 'asha@example.test' : 'doctor@example.test';
    setData(initial); setSelected(initial.patients[0]?.id ?? ''); setDemo(true); setAuth(null); setLoading(false); setTab('overview'); setError(''); setNotice('');
    window.history.replaceState(null, '', `/portal?demo=${role === 'patient' ? 'patient' : 'clinician'}`);
  }

  async function loadAccount() {
    const status = await api('auth') as AuthStatus;
    setAuth(status);
    if (status.staff && !status.verified) { setLoading(false); return; }
    const next = await api('data') as PortalData;
    setData(next); setSelected(current => next.patients.some(p => p.id === current) ? current : next.patients[0]?.id ?? '');
    setLoading(false);
  }

  async function refreshAccount() {
    setBusy(true); setError(''); setNotice('');
    try { await loadAccount(); setNotice('Care record refreshed.'); }
    catch (e) {
      setError((e as Error).message);
      if (e instanceof CareApiError && (e.status === 401 || e.status === 403)) setData(null);
    } finally { setBusy(false); }
  }

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    if (fragment.has('access_token') || fragment.has('error') || query.has('code') || query.has('error')) {
      window.history.replaceState(null, '', '/portal');
      if (fragment.has('error') || query.has('error')) { setError('This email link is invalid or expired. Request a new sign-in link.'); setLoading(false); return; }
      if (query.has('code')) {
        authenticate({ action: 'exchange-link', code: query.get('code'), flow_id: query.get('sb_flow_id') }).finally(() => setLoading(false));
        return;
      }
      if (fragment.get('type') === 'invite' && fragment.get('access_token') && fragment.get('refresh_token')) {
        setInviteTokens({ access_token: fragment.get('access_token')!, refresh_token: fragment.get('refresh_token')! }); setLoading(false); return;
      }
      setError('Please request a new sign-in link from this portal.'); setLoading(false); return;
    }
    if (query.has('demo')) { enterDemo(query.get('demo') === 'clinician' ? 'lead' : 'patient'); return; }
    if (query.has('invited')) { setInvitation(true); setCodeSent(true); }
    if (connected) loadAccount().catch((e: Error) => { if (!(e instanceof CareApiError) || e.status !== 401) setError(e.message); setLoading(false); });
    // Account data is loaded once on entry; all mutations explicitly refresh it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  async function signOut() {
    setBusy(true); setError('');
    try {
      if (!demo) await api('auth', { action: 'logout' });
      setData(null); setAuth(null); setDemo(false); setEnrollment(null); setInviteTokens(null); setNotice(''); setCodeSent(false); setTab('overview');
      window.history.replaceState(null, '', '/portal');
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  async function authenticate(action: object) {
    setBusy(true); setError(''); setNotice('');
    try {
      const result = await api('auth', action);
      if (result.message) { setNotice(result.message); setCodeSent(true); }
      else if (result.qr) setEnrollment(result);
      else { setEnrollment(null); setInviteTokens(null); await loadAccount(); }
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  const staff = data?.role !== 'patient';
  const patient = data?.patients.find(p => p.id === selected);
  const plans = data?.plans.filter(p => p.patient_id === selected) ?? [];
  const plan = plans[0];
  const checkins = data?.checkins.filter(c => c.patient_id === selected) ?? [];
  const observations = data?.observations.filter(o => o.patient_id === selected) ?? [];
  const notes = data?.notes.filter(n => n.patient_id === selected && (staff || n.published)) ?? [];
  const appointments = data?.appointments.filter(a => a.patient_id === selected) ?? [];
  const reports = data?.reports.filter(r => r.patient_id === selected) ?? [];
  const openReviews = data?.checkins.filter(c => !c.reviewed_at) ?? [];

  function navigate(next: Tab) { setTab(next); setNotice(''); setError(''); }

  async function mutate(input: Mutation): Promise<boolean> {
    if (!data) return false;
    setBusy(true); setError(''); setNotice('');
    const action: Mutation & { patient_id: string } = { ...input, patient_id: input.patient_id ?? selected };
    try {
      if (!demo) {
        const result = await api('data', action);
        const next = await api('data') as PortalData; setData(next);
        if (result.patient_id) { setSelected(result.patient_id); setTab('overview'); }
        setNotice(result.message ?? 'Saved successfully.');
      } else {
        const next = structuredClone(data), id = `demo-${crypto.randomUUID()}`, created_at = new Date().toISOString(), patient_id = String(action.patient_id);
        if (action.action === 'create-patient') {
          next.patients.push({ id, name: String(action.name), email: String(action.email), condition: String(action.condition), clinic_id: 'demo', clinician_id: 'demo-doctor', user_id: null, created_at }); setSelected(id); setTab('overview');
        } else if (action.action === 'plan') {
          next.plans.unshift({ id, patient_id, title: String(action.title), precautions: String(action.precautions), review_date: String(action.review_date), activities: (action.activities as { title: string; instruction: string }[]).map((a, i) => ({ ...a, id: `${id}-${i}`, frequency: 'Daily · as prescribed' })), goals: [{ title: String(action.goal), target: String(action.target) }], created_at });
        } else if (action.action === 'checkin') {
          if (next.checkins.some(c => c.patient_id === patient_id && c.day === action.day)) throw new Error('A check-in is already recorded for this day.');
          next.checkins.unshift({ id, patient_id, plan_id: String(action.plan_id), day: String(action.day), completed: action.completed as string[], pain: Number(action.pain), energy: Number(action.energy), comment: String(action.comment), reviewed_at: null, created_at });
        } else if (action.action === 'note') {
          next.notes.unshift({ id, patient_id, title: String(action.title), body: String(action.body), published: Boolean(action.published), created_at });
        } else if (action.action === 'observation') {
          next.observations.push({ id, patient_id, label: String(action.label), value: Number(action.value), unit: String(action.unit), direction: action.direction as 'higher' | 'lower', measured_on: String(action.measured_on), created_at });
        } else if (action.action === 'appointment') {
          next.appointments.push({ id, patient_id, title: String(action.title), starts_at: String(action.starts_at), location: String(action.location), created_at }); next.appointments.sort((a, b) => a.starts_at.localeCompare(b.starts_at));
        } else if (action.action === 'review') {
          const checkin = next.checkins.find(c => c.id === action.checkin_id); if (checkin) checkin.reviewed_at = created_at;
        } else if (action.action === 'report' && patient) {
          if (String(action.period_start) > String(action.period_end) || String(action.period_end) > today()) throw new Error('Choose a reporting period ending today or earlier.');
          next.reports.unshift({ id, patient_id, title: String(action.title), summary: String(action.summary), next_steps: String(action.next_steps), created_at, snapshot: { patient_name: patient.name, condition: patient.condition, plan: plans.find(p => p.created_at.slice(0, 10) <= String(action.period_end)) ?? null, observations: observations.filter(o => o.measured_on >= String(action.period_start) && o.measured_on <= String(action.period_end)), checkins: checkins.filter(c => c.day >= String(action.period_start) && c.day <= String(action.period_end)), notes: notes.filter(n => n.published && n.created_at.slice(0, 10) >= String(action.period_start) && n.created_at.slice(0, 10) <= String(action.period_end)), period_start: String(action.period_start), period_end: String(action.period_end), author: 'Demo clinician · fictional report' } });
        }
        setData(next);
        try { sessionStorage.setItem(demoKey, JSON.stringify(next)); } catch { /* Session can still be explored without browser storage. */ }
        setNotice('Saved in this fictional demo session. Switch views to follow the care journey.');
      }
      return true;
    } catch (e) { setError((e as Error).message); return false; }
    finally { setBusy(false); }
  }

  const signInLabel = busy ? 'Please wait...' : inviteTokens ? 'Confirm email and accept invitation' : codeSent && (emailMode === 'code' || invitation) ? 'Verify and continue' : emailMode === 'link' ? (codeSent ? 'Send another sign-in link' : 'Email me a sign-in link') : 'Email me a sign-in code';

  const messages = <div className="cp-messages">{error && <div className="cp-alert cp-error" role="alert">{error}</div>}{notice && <div className="cp-alert cp-success" role="status"><CheckCircle2 size={18} />{notice}</div>}</div>;

  if (!data) return <main className="cp-login"><div className="cp-login-brand"><Link href="/" className="cp-wordmark">neuro<span>ficio</span><small>CARE PORTAL</small></Link><Link href="/" className="cp-back">Back to website <ArrowUpRight size={16} /></Link></div>
    <div className="cp-login-grid"><section className="cp-welcome"><span className="cp-kicker">A little progress. Every day.</span><h1>Your care.<br />Your progress.<br /><em>All in one place.</em></h1><p>A clearer picture of your recovery, with your home-care plan and your care team beside you.</p><div className="cp-welcome-features"><span><ClipboardList />A plan shaped around you</span><span><TrendingUp />Progress you can follow</span><span><Stethoscope />Connected to your care team</span></div><div className="cp-login-note"><Heart size={22} /><p>Designed for patients, families and the clinicians supporting their recovery.</p></div></section>
    <section className="cp-card cp-signin">{loading ? <div role="status"><ShieldCheck size={32} /><h2>Opening your care account…</h2></div> : auth?.staff && !auth.verified ? <>
      <span className="cp-icon-tile"><ShieldCheck /></span><span className="cp-kicker">Clinical workspace</span><h2>One more security check</h2><p>Use an authenticator app to protect access to clinical records.</p>{messages}
      {!auth.factors.length && !enrollment && <button disabled={busy} className="cp-button" onClick={() => authenticate({ action: 'enroll-mfa' })}>Set up authenticator <ArrowRight size={16} /></button>}
      {enrollment && <div className="cp-mfa"><img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(enrollment.qr)}`} alt="Scan this QR code with your authenticator app" width="200" height="200" /><p>Or enter this setup key:</p><code>{enrollment.secret}</code></div>}
      {(enrollment || auth.factors.length > 0) && <form onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); authenticate({ action: 'verify-mfa', factor_id: f.get('factor_id'), code: f.get('code') }); }}><fieldset disabled={busy}>{auth.factors.length > 1 ? <Field label="Authenticator"><select name="factor_id">{auth.factors.map(f => <option value={f.id} key={f.id}>{f.name ?? 'Authenticator'}</option>)}</select></Field> : <input type="hidden" name="factor_id" value={enrollment?.id ?? auth.factors[0]?.id ?? ''} />}<Field label="Six-digit authenticator code"><input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required /></Field><button className="cp-button">{busy ? 'Verifying…' : 'Open clinical workspace'}<ArrowRight size={16} /></button></fieldset></form>}
      <button className="cp-text-button" onClick={signOut} disabled={busy}>Sign out</button>
    </> : <>
      <span className="cp-icon-tile"><ShieldCheck /></span><span className="cp-kicker">Welcome to NeuroFicio</span><h2>{inviteTokens ? "Accept your care invitation" : "Sign in to your care"}</h2><p>{inviteTokens ? "Confirm the email address your invitation was sent to. This opens that account only." : "Use the email address registered with your care team."}</p>{messages}
      {connected ? <form onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); authenticate(inviteTokens ? { action: 'accept-invitation-link', email: address, ...inviteTokens } : codeSent && (emailMode === 'code' || invitation) ? { action: 'verify-code', email: address, code: f.get('code'), invitation } : { action: 'send-code', email: address }); }}><fieldset disabled={busy}><Field label="Email address"><input type="email" required value={address} onChange={e => setAddress(e.target.value)} autoComplete="email" maxLength={254} placeholder="you@example.com" /></Field>{codeSent && (emailMode === 'code' || invitation) && !inviteTokens && <Field label={invitation ? 'Invitation code from your email' : 'Sign-in code from your email'}><input name="code" required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,10}" minLength={6} maxLength={10} /></Field>}<button className="cp-button cp-wide">{signInLabel}<ArrowRight size={17} /></button></fieldset></form> : <div className="cp-alert">Secure email sign-in is awaiting backend configuration. Explore the working demo below using fictional records.</div>}
      {connected && !inviteTokens && <div className="cp-login-links"><button className="cp-text-button" disabled={busy} onClick={() => { setCodeSent(!codeSent); setInvitation(!codeSent); setNotice(''); }}>{codeSent ? 'Back to sign-in' : 'I have an invitation code'}</button><p>New patient? Your care team will invite you.</p></div>}
      <div className="cp-demo-entry"><span className="cp-kicker">Explore the initial platform</span><p>Fictional records only. Please do not enter real patient or medical information.</p><div><button className="cp-button cp-secondary" onClick={() => enterDemo('patient')}>Patient demo <ArrowRight size={15} /></button><button className="cp-button cp-secondary" onClick={() => enterDemo('lead')}>Doctor demo <ArrowRight size={15} /></button></div></div>
      <small className="cp-login-privacy"><ShieldCheck size={14} />Email verification · Individual patient access</small>
    </>}</section></div><footer className="cp-login-footer">NeuroFicio by Therapy Partners <span>Care portal · Initial release</span></footer></main>;

  const latestObservation = observations[observations.length - 1];
  const selectedReviews = checkins.filter(c => !c.reviewed_at);
  const nextAppointment = appointments.find(a => Date.parse(a.starts_at) >= Date.now());

  return <div className={`cp-app ${staff ? 'cp-clinical' : 'cp-patient'}`}><a className="cp-skip" href="#care-content">Skip to care content</a>
    {demo && <div className="cp-demo-bar"><span><ShieldCheck size={15} /><strong>Fictional demo</strong><span>Do not enter real patient information. Changes stay in this browser tab.</span></span><div><button onClick={() => enterDemo(staff ? 'patient' : 'lead')}>Switch to {staff ? 'patient' : 'doctor'} view <ArrowRight size={14} /></button><button onClick={() => { sessionStorage.removeItem(demoKey); enterDemo(staff ? 'lead' : 'patient'); }}>Reset demo</button></div></div>}
    <aside className="cp-sidebar"><Link href="/" className="cp-wordmark">neuro<span>ficio</span><small>CARE PORTAL</small></Link><div className="cp-space-label">{staff ? 'Clinical workspace' : 'Your recovery space'}</div><nav aria-label="Care portal">{tabs.filter(t => staff || t.id !== 'patients').map(({ id, label, icon: Icon }) => <button key={id} className={tab === id ? 'active' : ''} aria-current={tab === id ? 'page' : undefined} onClick={() => navigate(id)}><Icon size={19} /><span>{staff && id === 'notes' ? 'Clinical notes' : label}</span>{staff && id === 'checkin' && openReviews.length > 0 && <small>{openReviews.length}</small>}</button>)}</nav><div className="cp-sidebar-bottom"><div className="cp-help"><Heart size={20} /><strong>Care is a shared journey.</strong><p>Small steps and regular reviews help your team understand your needs.</p></div><Link href="/contact">Contact NeuroFicio <ArrowUpRight size={15} /></Link><button onClick={signOut} disabled={busy}><LogOut size={17} />{demo ? 'Exit demo' : 'Sign out'}</button></div></aside>
    <div className="cp-workspace"><header className="cp-topbar"><div><span className="cp-kicker">{staff ? 'Care team' : 'Patient portal'}</span><span className="cp-topbar-date">{date(today())}</span></div><div className="cp-account">{!demo && <button className="cp-text-button" disabled={busy} onClick={refreshAccount} aria-label="Refresh care record"><RefreshCw size={17} /></button>}<span className="cp-avatar">{staff ? 'DR' : (patient?.name[0] ?? 'P')}</span><span><strong>{staff ? (data.role === 'lead' ? 'Lead clinician' : 'Treating clinician') : (patient?.name ?? 'Patient account')}</strong><small>{data.email}</small></span></div></header>
      <main id="care-content" className="cp-content" tabIndex={-1}><div className="cp-page-heading"><div><div className="cp-breadcrumb">Care portal <ChevronRight size={12} />{tabs.find(t => t.id === tab)?.label}</div><h1>{tab === 'overview' ? (staff ? 'A clear view of your care.' : `Hello, ${patient?.name.split(' ')[0] ?? 'there'}.`) : tab === 'patients' ? 'Every patient. A personal journey.' : tabs.find(t => t.id === tab)?.label}</h1><p>{tab === 'overview' ? (staff ? 'Keep care coordinated, review progress and plan the next step.' : 'Your next step starts here. Let’s keep moving forward, together.') : patient ? `${patient.name} · ${patient.condition}` : 'Select or add a patient to begin.'}</p></div>{!staff && plan && tab === 'overview' && <button className="cp-button" onClick={() => navigate('checkin')}>Record today’s check-in <Plus size={17} /></button>}</div>
      {staff && data.patients.length > 0 && tab !== 'patients' && <div className="cp-patient-picker"><Users size={18} /><label htmlFor="care-patient">Patient record</label><select id="care-patient" value={selected} onChange={e => { setSelected(e.target.value); setNotice(''); setError(''); }}>{data.patients.map(p => <option value={p.id} key={p.id}>{p.name} · {p.condition}</option>)}</select>{data.role === 'lead' && <span className="cp-badge">Clinic-wide access</span>}</div>}
      {messages}

      {tab === 'patients' && staff && <><div className="cp-card"><div className="cp-card-head"><h2>Patient registry <span className="cp-count">{data.patients.length}</span></h2><label className="cp-search"><Search size={17} /><input aria-label="Search patients" placeholder="Search name or care pathway" value={search} onChange={e => setSearch(e.target.value)} /></label></div><div className="cp-table-scroll"><table><thead><tr><th>Patient</th><th>Care pathway</th><th>Review queue</th><th>Record</th></tr></thead><tbody>{data.patients.filter(p => `${p.name} ${p.condition}`.toLowerCase().includes(search.toLowerCase())).map(p => <tr key={p.id}><td><strong>{p.name}</strong><small className="cp-cell-sub">{p.email}</small></td><td>{p.condition}</td><td>{data.checkins.filter(c => c.patient_id === p.id && !c.reviewed_at).length} check-ins</td><td><button className="cp-text-button" onClick={() => { setSelected(p.id); navigate('overview'); }}>Open record <ArrowRight size={15} /></button></td></tr>)}</tbody></table></div>{!data.patients.length && <Empty title="Your first patient starts here">Create a record below, then add an assessment and home-care programme.</Empty>}</div>
        <ActionForm title="Create a patient record" submit="Create patient record" busy={busy} onSave={f => mutate({ action: 'create-patient', name: f.get('name'), email: f.get('email'), condition: f.get('condition') })}><p className="cp-form-note">Verify the patient’s identity and email before sending an invitation. {demo && 'Use fictional details only.'}</p><div className="cp-form-grid"><Field label="Patient name"><input name="name" maxLength={100} required /></Field><Field label="Patient email"><input name="email" type="email" maxLength={254} required /></Field></div><Field label="Care pathway / condition"><input name="condition" required maxLength={150} placeholder="e.g. Stroke rehabilitation" /></Field></ActionForm></>}

      {tab === 'overview' && <>
        <div className="cp-stats">{staff ? <><Stat icon={Users} label="Patients in your care" value={String(data.patients.length)} detail={data.role === 'lead' ? 'Across your clinic' : 'Assigned to you'} /><Stat icon={ClipboardList} label="Awaiting review" value={String(openReviews.length)} detail="Submitted patient check-ins" /><Stat icon={CalendarDays} label="Upcoming visits" value={String(data.appointments.filter(a => Date.parse(a.starts_at) >= Date.now()).length)} detail="Scheduled appointments" /></> : <><Stat icon={ClipboardList} label="Your home programme" value={String(plan?.activities.length ?? 0)} detail="Activities in your current plan" /><Stat icon={Activity} label="Latest measurement" value={latestObservation ? `${latestObservation.value} ${latestObservation.unit}` : '—'} detail={latestObservation?.label ?? 'Your assessment will set a baseline'} /><Stat icon={CalendarDays} label="Next care review" value={plan ? new Date(plan.review_date + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'To be agreed'} detail="A chance to reflect and adjust" /></>}</div>
        {!patient ? <Empty title={staff ? 'Let’s begin with a patient' : 'Your care record is being prepared'}>{staff ? <button className="cp-button" onClick={() => navigate('patients')}>Add your first patient <Plus size={16} /></button> : 'Your verified email is not linked to an active patient record yet. Contact the care team to check your invitation.'}</Empty> : <>
          {staff && <div className="cp-record-strip"><div><span className="cp-avatar">{patient.name[0]}</span><div><h2>{patient.name}</h2><p>{patient.condition} · Added {date(patient.created_at)}</p></div></div>{!demo && <button disabled={busy || !data.canInvite} className="cp-button cp-secondary" onClick={() => mutate({ action: 'invite' })}>{data.canInvite ? 'Send patient invitation' : 'Invitations need server setup'}<ArrowUpRight size={15} /></button>}</div>}
          <div className="cp-two-col"><section className="cp-card cp-plan-preview"><div className="cp-card-head"><div><span className="cp-kicker">One step at a time</span><h2>{staff ? 'Current home programme' : 'Your home programme'}</h2></div><span className="cp-icon-tile"><ClipboardList /></span></div>{plan ? <><p>{plan.title}</p><div className="cp-mini-activities">{plan.activities.map((a, i) => <div key={a.id}><span>{String(i + 1).padStart(2, '0')}</span><div><strong>{a.title}</strong><small>{a.frequency}</small></div><ChevronRight size={16} /></div>)}</div><button className="cp-text-button" onClick={() => navigate('plan')}>View complete care plan <ArrowRight size={16} /></button></> : <Empty title="A plan built around the patient">{staff ? 'Publish the first home-care plan from the Care plan page.' : 'Your clinician will publish your personalised programme here.'}</Empty>}</section>
            <div className="cp-stack"><section className="cp-card cp-next-visit"><span className="cp-kicker">Next appointment</span><CalendarDays size={23} /><h3>{nextAppointment ? date(nextAppointment.starts_at) : 'Your next visit'}</h3><p>{nextAppointment ? `${time(nextAppointment.starts_at)} · ${nextAppointment.title}` : 'The care team will arrange the next appointment.'}</p>{nextAppointment && <small>{nextAppointment.location}</small>}<button className="cp-text-button" onClick={() => navigate('appointments')}>View appointments <ArrowRight size={16} /></button></section><section className="cp-card cp-update-preview"><span className="cp-kicker">From your care team</span><h3>{notes.find(n => n.published)?.title ?? 'Updates will appear here'}</h3><p>{notes.find(n => n.published)?.body ?? 'Your clinician can share instructions and review summaries with you here.'}</p><button className="cp-text-button" onClick={() => navigate('notes')}>Read care updates <ArrowRight size={16} /></button></section></div></div>
          {staff && selectedReviews.length > 0 && <section className="cp-card"><div className="cp-card-head"><h2>Check-ins needing review</h2><span className="cp-badge">{selectedReviews.length} waiting</span></div>{selectedReviews.map(c => <div className="cp-review-row" key={c.id}><div><strong>{date(c.day)}</strong><p>{c.comment || 'No additional comment.'}</p><small>Pain {c.pain}/10 · Energy {c.energy}/5</small></div><button disabled={busy} className="cp-button cp-secondary" onClick={() => mutate({ action: 'review', checkin_id: c.id })}><Check size={16} />Mark reviewed</button></div>)}</section>}
          <div className="cp-section-head"><div><span className="cp-kicker">The bigger picture</span><h2>Progress over time</h2></div><button className="cp-text-button" onClick={() => navigate('progress')}>View all progress <ArrowRight size={16} /></button></div><MetricsChart observations={observations} />
        </>}
      </>}

      {patient && tab === 'plan' && <><section className="cp-card"><div className="cp-card-head"><div><span className="cp-kicker">{plan ? `Published ${date(plan.created_at)}` : 'Personalised home care'}</span><h2>{plan?.title ?? 'Your care plan'}</h2></div>{plan && <span className="cp-badge">Review {date(plan.review_date)}</span>}</div>{plan ? <><div className="cp-precautions"><ShieldCheck size={21} /><div><strong>Before you begin</strong><p className="cp-preserve">{plan.precautions}</p></div></div><div className="cp-activity-list">{plan.activities.map((a, i) => <article key={a.id}><span className="cp-activity-number">{i + 1}</span><div><h3>{a.title}</h3><span className="cp-badge">{a.frequency}</span><p className="cp-preserve">{a.instruction}</p></div></article>)}</div><h3>Your recovery goals</h3><div className="cp-goals">{plan.goals.map((g, i) => <div key={i}><CheckCircle2 size={20} /><div><strong>{g.title}</strong><p>{g.target}</p></div></div>)}</div></> : <Empty title="No programme published yet">The treating clinician will agree goals and publish a plan after assessment.</Empty>}</section>
        {staff && <ActionForm title={plan ? 'Publish a revised care plan' : 'Publish the first care plan'} submit="Publish care plan to patient" busy={busy} onSave={f => {
          const activities = String(f.get('activities')).split('\n').filter(l => l.trim()).map(l => { const [title, ...instruction] = l.split('|'); return { title: title.trim(), instruction: instruction.join('|').trim() }; });
          if (activities.some(a => !a.title || !a.instruction)) { setError('Each activity needs a title and instructions, separated by |.'); return Promise.resolve(false); }
          return mutate({ action: 'plan', title: f.get('title'), precautions: f.get('precautions'), review_date: f.get('review_date'), goal: f.get('goal'), target: f.get('target'), activities });
        }}><p className="cp-form-note">Publishing creates a new version. Previous plans and their check-ins remain in the record. This initial programme supports daily activities.</p><Field label="Programme title"><input name="title" defaultValue={plan?.title} maxLength={150} required /></Field><Field label="Daily activities" hint="One per line: Activity title | Complete patient instructions, repetitions, assistance and timing. Maximum 12 activities."><textarea name="activities" rows={5} defaultValue={plan?.activities.map(a => `${a.title} | ${a.instruction}`).join('\n')} maxLength={14000} required /></Field><Field label="Precautions and assistance required"><textarea name="precautions" rows={3} defaultValue={plan?.precautions} maxLength={2000} required /></Field><div className="cp-form-grid"><Field label="Recovery goal"><input name="goal" defaultValue={plan?.goals[0]?.title} maxLength={300} required /></Field><Field label="How this goal will be reviewed"><input name="target" defaultValue={plan?.goals[0]?.target} maxLength={500} required /></Field></div><Field label="Next review date"><input name="review_date" type="date" min={today()} required /></Field></ActionForm>}
        {plans.length > 1 && <details className="cp-card"><summary>Previous programme versions ({plans.length - 1})</summary>{plans.slice(1).map(p => <div className="cp-history-item" key={p.id}><strong>{p.title}</strong><p>Published {date(p.created_at)} · {p.activities.length} activities · Review {date(p.review_date)}</p><p>{p.precautions}</p>{p.activities.map(a => <p key={a.id}><strong>{a.title}</strong> — {a.instruction}</p>)}</div>)}</details>}
      </>}

      {patient && tab === 'checkin' && <>{!staff && (plan ? <ActionForm title="How did your home programme go?" submit="Save my check-in" busy={busy} onSave={f => mutate({ action: 'checkin', plan_id: plan.id, day: f.get('day'), completed: f.getAll('completed'), pain: Number(f.get('pain')), energy: Number(f.get('energy')), comment: f.get('comment') })}><p className="cp-form-note">Tick only the activities you completed. An unchecked activity means it was not recorded as completed. Add a reason or difficulty below.</p><Field label="Check-in date"><input name="day" type="date" defaultValue={today()} max={today()} min={new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)} required /></Field><div className="cp-checklist">{plan.activities.map(a => <label key={a.id}><input type="checkbox" name="completed" value={a.id} /><span><strong>{a.title}</strong><small>{a.frequency}</small></span></label>)}</div><div className="cp-form-grid"><Field label="Pain today" hint="0 = no pain, 10 = worst pain"><select name="pain" defaultValue="" required><option value="" disabled>Choose a score</option>{Array.from({ length: 11 }, (_, i) => <option key={i} value={i}>{i} / 10</option>)}</select></Field><Field label="Energy today" hint="1 = very low, 5 = very good"><select name="energy" defaultValue="" required><option value="" disabled>Choose a score</option>{Array.from({ length: 5 }, (_, i) => <option key={i} value={i + 1}>{i + 1} / 5</option>)}</select></Field></div><Field label="Anything your care team should know?" hint="Include difficulties, skipped activities or help you needed."><textarea name="comment" rows={3} maxLength={2000} /></Field><p className="cp-form-note">One check-in per day. Your care team reviews submissions during its working hours. This is not an emergency or continuously monitored channel.</p></ActionForm> : <Empty title="A care plan is needed first">Once your clinician publishes a programme, you can record your activities here.</Empty>)}
        <section className="cp-card"><h2>{staff ? 'Patient check-in history' : 'Your check-in history'}</h2>{checkins.length ? checkins.map(c => <div className="cp-checkin-item" key={c.id}><div className="cp-card-head"><h3>{date(c.day)}</h3><span className={`cp-badge ${c.reviewed_at ? '' : 'cp-waiting'}`}>{c.reviewed_at ? 'Reviewed by care team' : 'Awaiting team review'}</span></div><div className="cp-checkin-scores"><span>Pain <strong>{c.pain}/10</strong></span><span>Energy <strong>{c.energy}/5</strong></span><span>Activities recorded <strong>{c.completed.length}/{data.plans.find(p => p.id === c.plan_id)?.activities.length ?? '—'}</strong></span></div><p className="cp-preserve">{c.comment || 'No additional comment.'}</p><small>Submitted by patient · Plan version {c.plan_id.slice(0, 8)}</small>{staff && !c.reviewed_at && <button disabled={busy} className="cp-button cp-secondary" onClick={() => mutate({ action: 'review', checkin_id: c.id })}>Mark reviewed <Check size={16} /></button>}</div>) : <Empty title="No check-ins yet">Submitted daily check-ins will appear here.</Empty>}</section>
      </>}

      {patient && tab === 'progress' && <><div className="cp-alert"><TrendingUp size={20} />Measurements are recorded by your clinician. Symptoms and activity completion are shown separately and do not determine a recovery percentage.</div><MetricsChart observations={observations} />
        <section className="cp-card"><h2>Patient-reported symptoms</h2>{checkins.length ? <div className="cp-table-scroll"><table><thead><tr><th>Date</th><th>Pain / 10</th><th>Energy / 5</th><th>Source</th></tr></thead><tbody>{checkins.map(c => <tr key={c.id}><td>{date(c.day)}</td><td>{c.pain}</td><td>{c.energy}</td><td>Patient check-in</td></tr>)}</tbody></table></div> : <p>No patient-reported symptoms recorded yet.</p>}<p className="cp-muted">Dates without a check-in have no recorded response.</p></section>
        {staff && <ActionForm title="Record an assessment measurement" submit="Save measurement" busy={busy} onSave={f => mutate({ action: 'observation', label: f.get('label'), value: Number(f.get('value')), unit: f.get('unit'), direction: f.get('direction'), measured_on: f.get('measured_on') })}><p className="cp-form-note">Use consistent measure names, units and assessment methods. Add a new entry to correct a measurement; records are retained.</p><Field label="Measure name"><input name="label" required maxLength={100} defaultValue={latestObservation?.label} /></Field><div className="cp-form-grid"><Field label="Measured value"><input name="value" type="number" min={0} max={100000} step="any" required /></Field><Field label="Unit"><input name="unit" required maxLength={30} defaultValue={latestObservation?.unit} placeholder="e.g. m, seconds, points" /></Field></div><div className="cp-form-grid"><Field label="Intended direction"><select name="direction"><option value="higher">Higher value</option><option value="lower">Lower value</option></select></Field><Field label="Assessment date"><input name="measured_on" type="date" defaultValue={today()} max={today()} required /></Field></div></ActionForm>}
      </>}

      {patient && tab === 'notes' && <>{staff && <ActionForm title="Add clinical documentation" submit="Save care note" busy={busy} onSave={f => mutate({ action: 'note', title: f.get('title'), body: f.get('body'), published: f.get('visibility') === 'published' })}><Field label="Note title"><input name="title" required maxLength={150} /></Field><Field label="Clinical note or patient instructions"><textarea name="body" required rows={5} maxLength={6000} /></Field><Field label="Who should see this note?" hint="Shared updates are published immediately. Internal drafts stay in the clinical workspace."><select name="visibility"><option value="internal">Clinical team only · internal draft</option><option value="published">Publish to patient · care instructions</option></select></Field><p className="cp-form-note">Saved entries are retained. Add a clearly labelled amendment when correcting a previous entry. This feature records care instructions; it does not issue medication prescriptions.</p></ActionForm>}
        {notes.length ? notes.map(n => <article className="cp-card cp-note" key={n.id}><div className="cp-card-head"><span className="cp-kicker">{date(n.created_at)} · Care team</span><span className={`cp-badge ${n.published ? '' : 'cp-waiting'}`}>{n.published ? 'Shared with patient' : 'Internal draft'}</span></div><h2>{n.title}</h2><p className="cp-preserve">{n.body}</p></article>) : <Empty title="Care updates will appear here">Your clinician can share review summaries and instructions after your assessment.</Empty>}
      </>}

      {patient && tab === 'appointments' && <><section className="cp-card"><h2>Your care appointments</h2>{appointments.length ? appointments.map(a => <div className="cp-appointment" key={a.id}><div className="cp-date-tile"><strong>{new Date(a.starts_at).getDate()}</strong><span>{new Date(a.starts_at).toLocaleDateString('en-GB', { month: 'short' })}</span></div><div><h3>{a.title}</h3><p>{date(a.starts_at)} · {time(a.starts_at)}</p><small>{a.location}</small></div><span className="cp-badge">{Date.parse(a.starts_at) < Date.now() ? 'Past appointment' : 'Scheduled'}</span></div>) : <Empty title="No appointments scheduled">Your care team will arrange your next appointment with you.</Empty>}</section>
        {staff && <ActionForm title="Schedule a care appointment" submit="Save appointment" busy={busy} onSave={f => mutate({ action: 'appointment', title: f.get('title'), starts_at: new Date(String(f.get('starts_at'))).toISOString(), location: f.get('location') })}><Field label="Appointment title"><input name="title" maxLength={150} required placeholder="Home rehabilitation visit" /></Field><div className="cp-form-grid"><Field label="Date and time" hint="Enter in your device’s local timezone. The saved time is converted for each viewer."><input name="starts_at" type="datetime-local" required /></Field><Field label="Location or visit format"><input name="location" maxLength={200} required placeholder="Home visit · Hyderabad" /></Field></div></ActionForm>}
      </>}

      {patient && tab === 'reports' && <>{staff && <ActionForm title="Review and publish a progress report" submit="Confirm review and publish report" busy={busy} onSave={f => mutate({ action: 'report', title: f.get('title'), period_start: f.get('period_start'), period_end: f.get('period_end'), summary: f.get('summary'), next_steps: f.get('next_steps') })}><p className="cp-form-note">Publishing confirms that you have reviewed the selected period. The report captures a fixed copy of recorded measurements, shared notes and the care plan available at the period’s end.</p><Field label="Report title"><input name="title" required maxLength={150} placeholder="Home rehabilitation progress review" /></Field><div className="cp-form-grid"><Field label="Reporting period starts"><input name="period_start" type="date" defaultValue={demo ? new Date(Date.now() - 28 * 86400000).toISOString().slice(0, 10) : undefined} max={today()} required /></Field><Field label="Reporting period ends"><input name="period_end" type="date" defaultValue={today()} max={today()} required /></Field></div><Field label="Clinical interpretation and goal review"><textarea name="summary" rows={4} required maxLength={6000} /></Field><Field label="Next steps and follow-up"><textarea name="next_steps" rows={3} required maxLength={3000} /></Field></ActionForm>}
        {reports.length ? reports.map(r => <ReportView key={r.id} report={r} demo={demo} />) : <Empty title="A clear record of the journey">{staff ? 'Review the patient’s measurements and publish the first progress report above.' : 'Your clinician will publish a progress report after reviewing your care.'}</Empty>}
      </>}
      {!patient && tab !== 'patients' && tab !== 'overview' && <Empty title="No patient record selected">{staff ? 'Open Patients to create or select a record.' : 'Contact the care team to check that your account is linked to the correct record.'}</Empty>}
      <footer className="cp-care-footer"><ShieldCheck size={17} /><p>This portal is not continuously monitored. For urgent or worsening symptoms, seek local medical care. Contact your care team to discuss changes to your programme.</p></footer>
      </main>
    </div>
  </div>;
}

function Stat({ icon: Icon, label, value, detail }: { icon: typeof Heart; label: string; value: string; detail: string }) {
  return <div className="cp-stat"><div><span>{label}</span><Icon size={19} /></div><strong>{value}</strong><small>{detail}</small></div>;
}
