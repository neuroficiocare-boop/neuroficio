import { createClient } from '@supabase/supabase-js';
import { authenticated, checked, failure, identity, json } from '@/lib/portal/server';
import { completed, day, email, number, PortalError, sameOrigin, text, uuid } from '@/lib/portal/validation';
import type { Activity, Goal, Plan, ReportSnapshot } from '@/lib/portal/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { db, user } = await authenticated();
    const account = await identity(db);
    if (account.role === 'patient') checked(await db.rpc('care_claim_patient'));
    // Every table also enforces patient/clinic access through RLS.
    const results = await Promise.all([
      db.from('care_patients').select('*').order('created_at'),
      db.from('care_plans').select('*').order('created_at', { ascending: false }),
      db.from('care_checkins').select('*').order('day', { ascending: false }),
      db.from('care_observations').select('*').order('measured_on'),
      db.from('care_notes').select('*').order('created_at', { ascending: false }),
      db.from('care_appointments').select('*').order('starts_at'),
      db.from('care_reports').select('*').order('created_at', { ascending: false }),
    ]);
    const [patients, plans, checkins, observations, notes, appointments, reports] = results.map(r => checked(r));
    return json({ role: account.role, email: user.email, patients, plans, checkins, observations, notes, appointments, reports, canInvite: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) });
  } catch (error) { return failure(error); }
}

export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const raw = await request.text();
    if (raw.length > 32000) throw new PortalError('Request is too large.', 413);
    const body = JSON.parse(raw);
    const { db, user } = await authenticated();
    const account = await identity(db);
    const staff = account.role !== 'patient';
    const action = text(body.action, 'Action', 40);
    if (action === 'create-patient') {
      if (!staff) throw new PortalError('Only clinical staff can create patient records.', 403);
      const patient = checked(await db.from('care_patients').insert({ name: text(body.name, 'Patient name', 100), email: email(body.email), condition: text(body.condition, 'Care pathway', 150), clinic_id: account.clinic_id, clinician_id: user.id }).select().single());
      return json({ ok: true, patient_id: patient.id, message: 'Patient record created. Send an invitation when you have verified the recipient.' });
    }
    const patientId = uuid(body.patient_id);
    const patient = checked(await db.from('care_patients').select('*').eq('id', patientId).maybeSingle());
    if (!patient) throw new PortalError('This patient record is unavailable.', 404);

    if (action === 'checkin') {
      if (account.role !== 'patient' || patient.user_id !== user.id) throw new PortalError('Check-ins must be submitted by the patient account.', 403);
      const plan = checked(await db.from('care_plans').select('*').eq('patient_id', patientId).order('created_at', { ascending: false }).limit(1).maybeSingle()) as Plan | null;
      if (!plan || plan.id !== body.plan_id) throw new PortalError('Your care plan has changed. Refresh the page before submitting.');
      const checkinDay = day(body.day);
      const today = new Date().toISOString().slice(0, 10);
      if (checkinDay > today || Date.parse(today) - Date.parse(checkinDay) > 7 * 86400000) throw new PortalError('Choose today or a date within the last seven days.');
      checked(await db.from('care_checkins').insert({ patient_id: patientId, plan_id: plan.id, day: checkinDay, completed: completed(body.completed, plan.activities.map(a => a.id)), pain: number(body.pain, 'Pain', 0, 10), energy: number(body.energy, 'Energy', 1, 5), comment: text(body.comment, 'Check-in details', 2000, true) }));
      return json({ ok: true, message: 'Check-in saved for your care team. This is not a live monitoring service.' });
    }
    if (!staff) throw new PortalError('This action requires clinical access.', 403);

    if (action === 'invite') {
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new PortalError('Email invitations need the server invitation key. See the portal setup guide.', 503);
      // Validate access with the user's JWT above before using the privileged invitation API.
      const admin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
      const { error } = await admin.auth.admin.inviteUserByEmail(patient.email);
      if (error) throw new PortalError('Invitation could not be sent. If this patient already has an account, ask them to sign in with an email code.');
      checked(await db.rpc('care_record_invitation', { target_patient: patientId }));
      return json({ ok: true, message: 'Invitation sent. The patient can use the invitation code from their email.' });
    }
    if (action === 'plan') {
      if (!Array.isArray(body.activities) || body.activities.length < 1 || body.activities.length > 12) throw new PortalError('Add between 1 and 12 activities.');
      const activities: Activity[] = body.activities.map((a: Record<string, unknown>) => ({ id: crypto.randomUUID(), title: text(a.title, 'Activity title', 150), instruction: text(a.instruction, 'Instructions', 1000), frequency: 'Daily · as prescribed' }));
      const goals: Goal[] = [{ title: text(body.goal, 'Recovery goal', 300), target: text(body.target, 'Goal review criteria', 500) }];
      const review_date = day(body.review_date);
      if (review_date < new Date().toISOString().slice(0, 10)) throw new PortalError('The review date must be today or later.');
      checked(await db.from('care_plans').insert({ patient_id: patientId, title: text(body.title, 'Plan title', 150), precautions: text(body.precautions, 'Precautions', 2000), review_date, activities, goals }));
    } else if (action === 'note') {
      if (typeof body.published !== 'boolean') throw new PortalError('Choose the note visibility.');
      checked(await db.from('care_notes').insert({ patient_id: patientId, title: text(body.title, 'Note title', 150), body: text(body.body, 'Note', 6000), published: body.published }));
    } else if (action === 'observation') {
      if (body.direction !== 'higher' && body.direction !== 'lower') throw new PortalError('Choose how this measure is interpreted.');
      const measured_on = day(body.measured_on);
      if (measured_on > new Date().toISOString().slice(0, 10)) throw new PortalError('Measurement dates cannot be in the future.');
      checked(await db.from('care_observations').insert({ patient_id: patientId, label: text(body.label, 'Measure name', 100), value: number(body.value, 'Measurement', 0, 100000), unit: text(body.unit, 'Unit', 30), measured_on, direction: body.direction }));
    } else if (action === 'appointment') {
      const starts_at = text(body.starts_at, 'Appointment time', 40);
      if (!Number.isFinite(Date.parse(starts_at)) || Date.parse(starts_at) <= Date.now()) throw new PortalError('Choose a future appointment date and time.');
      checked(await db.from('care_appointments').insert({ patient_id: patientId, title: text(body.title, 'Appointment title', 150), starts_at, location: text(body.location, 'Location', 200) }));
    } else if (action === 'review') {
      checked(await db.rpc('care_review_checkin', { target_checkin: uuid(body.checkin_id), target_patient: patientId }));
    } else if (action === 'report') {
      const start = day(body.period_start), end = day(body.period_end);
      if (start > end || end > new Date().toISOString().slice(0, 10)) throw new PortalError('Choose a reporting period ending today or earlier.');
      const [plans, observations, checkins, notes] = await Promise.all([
        db.from('care_plans').select('*').eq('patient_id', patientId).lte('created_at', `${end}T23:59:59.999Z`).order('created_at', { ascending: false }).limit(1),
        db.from('care_observations').select('*').eq('patient_id', patientId).gte('measured_on', start).lte('measured_on', end).order('measured_on'),
        db.from('care_checkins').select('*').eq('patient_id', patientId).gte('day', start).lte('day', end).order('day'),
        db.from('care_notes').select('*').eq('patient_id', patientId).eq('published', true).gte('created_at', `${start}T00:00:00Z`).lte('created_at', `${end}T23:59:59.999Z`),
      ]);
      const snapshot: ReportSnapshot = { patient_name: patient.name, condition: patient.condition, plan: checked(plans)?.[0] ?? null, observations: checked(observations) ?? [], checkins: checked(checkins) ?? [], notes: checked(notes) ?? [], period_start: start, period_end: end, author: user.email ?? 'Care team' };
      checked(await db.from('care_reports').insert({ patient_id: patientId, title: text(body.title, 'Report title', 150), summary: text(body.summary, 'Clinical interpretation', 6000), next_steps: text(body.next_steps, 'Next steps', 3000), snapshot }));
    } else throw new PortalError('Unknown care action.');
    return json({ ok: true, message: action === 'report' ? 'Reviewed progress report published to the patient.' : 'Saved successfully.' });
  } catch (error) { return failure(error); }
}
