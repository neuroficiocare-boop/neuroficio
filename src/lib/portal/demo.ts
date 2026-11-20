import type { PortalData } from './types';

// Refresh generated wording in existing example sessions without discarding edits.
export function refreshExampleWording(data: PortalData): PortalData {
  const wording = new Map([
    ['Fictional demonstration programme. These activities are not personalised medical advice. Follow the plan agreed with your own treating team.', 'Follow the plan agreed with your treating team. Confirm activity levels, assistance and repetitions with your therapist before starting.'],
    ['Fictional demonstration only. Assistance, precautions and dosage must be agreed after an individual clinical assessment.', 'Assistance, precautions and activity levels must be agreed after an individual clinical assessment.'],
    ['Demonstration of an internal clinical draft. Check home layout and reassess the next functional goal at review.', 'Check home layout and reassess the next functional goal at review.'],
    ['Demonstration clinician · fictional report', 'NeuroFicio care team'],
    ['Demo clinician · fictional report', 'Care team'],
    ['Fictional review example: recorded activity tolerance has increased over the assessment period. The patient continues to need the assistance agreed in the care plan. Recorded participation and patient feedback should be reviewed alongside clinical assessment; they do not establish an overall recovery percentage.', 'Recorded activity tolerance has increased over the assessment period. The patient continues to need the assistance agreed in the care plan. Recorded participation and patient feedback should be reviewed alongside clinical assessment; they do not establish an overall recovery percentage.'],
  ]);
  return JSON.parse(JSON.stringify(data), (_key, value) => typeof value === 'string' ? wording.get(value) ?? value : value) as PortalData;
}

// Fictional records only. This module has no connection to the clinical backend.
export function demoData(): PortalData {
  const data: PortalData = {
    role: 'patient', email: 'patient@example.test', canInvite: false,
    patients: [
      { id: 'demo-asha', name: 'Asha Rao', email: 'asha@example.test', condition: 'Stroke rehabilitation', clinic_id: 'demo', clinician_id: 'demo-doctor', user_id: null, created_at: '2026-10-12T09:00:00Z' },
      { id: 'demo-arjun', name: 'Arjun Mehta', email: 'arjun@example.test', condition: 'Parkinson’s rehabilitation', clinic_id: 'demo', clinician_id: 'demo-doctor', user_id: null, created_at: '2026-11-02T09:00:00Z' },
      { id: 'demo-leela', name: 'Leela Shah', email: 'leela@example.test', condition: 'Brain injury rehabilitation', clinic_id: 'demo', clinician_id: 'demo-doctor', user_id: null, created_at: '2026-11-06T09:00:00Z' },
    ],
    plans: [{ id: 'demo-plan', patient_id: 'demo-asha', title: 'Building confidence in everyday movement', precautions: 'Follow the plan agreed with your treating team. Confirm activity levels, assistance and repetitions with your therapist before starting.', review_date: '2026-11-25', created_at: '2026-11-11T09:00:00Z',
      activities: [
        { id: 'demo-1', title: 'Supported sit-to-stand', instruction: 'Use the assistance and repetitions agreed with your therapist.', frequency: 'Daily · as prescribed' },
        { id: 'demo-2', title: 'Guided walking practice', instruction: 'Use prescribed walking support and caregiver assistance.', frequency: 'Daily · as prescribed' },
        { id: 'demo-3', title: 'Hand and reach practice', instruction: 'Practise the functional tasks selected during your visit.', frequency: 'Daily · as prescribed' },
      ], goals: [{ title: 'Move around the home with more confidence', target: 'Review walking support needs with the therapist.' }, { title: 'Take part in a daily household activity', target: 'Work toward the task agreed at assessment.' }] }],
    checkins: [
      { id: 'demo-c1', patient_id: 'demo-asha', plan_id: 'demo-plan', day: '2026-11-14', completed: ['demo-1', 'demo-2'], pain: 4, energy: 3, comment: 'Walking practice felt tiring today.', reviewed_at: '2026-11-15T09:00:00Z', created_at: '2026-11-14T14:00:00Z' },
      { id: 'demo-c2', patient_id: 'demo-asha', plan_id: 'demo-plan', day: '2026-11-16', completed: ['demo-1', 'demo-2', 'demo-3'], pain: 3, energy: 4, comment: 'More comfortable with the morning routine.', reviewed_at: null, created_at: '2026-11-16T14:00:00Z' },
    ],
    observations: [
      ...[18, 24, 31, 38].map((value, i) => ({ id: `demo-o${i}`, patient_id: 'demo-asha', label: 'Supported walking distance', value, unit: 'm', direction: 'higher' as const, measured_on: ['2026-10-28', '2026-11-04', '2026-11-11', '2026-11-18'][i], created_at: '2026-11-18T09:00:00Z' })),
    ],
    notes: [
      { id: 'demo-n1', patient_id: 'demo-asha', title: 'Your latest care update', body: 'Your recorded walking distance has increased across the last four assessments. We will review the assistance you need at your next visit. Continue only the activities in your agreed programme.', published: true, created_at: '2026-11-18T09:00:00Z' },
      { id: 'demo-n2', patient_id: 'demo-asha', title: 'Working note for next review', body: 'Check home layout and reassess the next functional goal at review.', published: false, created_at: '2026-11-17T09:00:00Z' },
    ],
    appointments: [ { id: 'demo-a1', patient_id: 'demo-asha', title: 'Home rehabilitation visit', starts_at: '2026-11-23T09:30:00+05:30', location: 'Home visit · Hyderabad', created_at: '2026-11-18T09:00:00Z' } ],
    reports: [],
  };

  // Every fictional patient has a complete journey for a useful clinical review.
  for (const [index, patient] of data.patients.slice(1).entries()) {
    const id = `demo-plan-${index + 2}`;
    data.plans.push({ id, patient_id: patient.id, title: index === 0 ? 'Confidence in your daily routine' : 'Practising meaningful everyday activities', precautions: 'Assistance, precautions and activity levels must be agreed after an individual clinical assessment.', review_date: '2026-11-25', created_at: '2026-11-11T09:00:00Z', activities: [
      { id: `${id}-1`, title: 'Therapist-guided movement practice', instruction: 'Follow the movements and assistance recorded by your treating therapist.', frequency: 'Daily · as prescribed' },
      { id: `${id}-2`, title: 'Everyday task practice', instruction: 'Practise the daily activity agreed with your therapist, using the prescribed support.', frequency: 'Daily · as prescribed' },
    ], goals: [{ title: 'Participate more comfortably in a daily routine', target: 'Review the assistance required for the personally selected task.' }] });
    data.observations.push(...[14, 18, 22].map((value, i) => ({ id: `demo-${index}-measure-${i}`, patient_id: patient.id, label: 'Supported activity duration', value: value + index * 2, unit: 'minutes', direction: 'higher' as const, measured_on: ['2026-11-04', '2026-11-11', '2026-11-18'][i], created_at: '2026-11-18T09:00:00Z' })));
    data.checkins.push({ id: `demo-checkin-${index}`, patient_id: patient.id, plan_id: id, day: '2026-11-17', completed: [`${id}-1`], pain: 2 + index, energy: 3, comment: 'Completed the first activity with the agreed assistance. Would like to review the second task at the next visit.', reviewed_at: null, created_at: '2026-11-17T14:00:00Z' });
    data.notes.push({ id: `demo-shared-${index}`, patient_id: patient.id, title: 'Plan for the next review', body: 'We will review your comfort, the support you need and your chosen daily activity at the next visit. Continue to follow the agreed programme and contact the care team with questions.', published: true, created_at: '2026-11-18T09:00:00Z' });
    data.appointments.push({ id: `demo-visit-${index}`, patient_id: patient.id, title: 'Home-care progress review', location: 'Home visit · Hyderabad', starts_at: `2026-11-${24 + index}T10:00:00+05:30`, created_at: '2026-11-18T09:00:00Z' });
  }
  for (const patient of data.patients) {
    data.reports.push({ id: `demo-report-${patient.id}`, patient_id: patient.id, title: 'Home rehabilitation progress review', summary: 'Recorded activity tolerance has increased over the assessment period. The patient continues to need the assistance agreed in the care plan. Recorded participation and patient feedback should be reviewed alongside clinical assessment; they do not establish an overall recovery percentage.', next_steps: 'Review the current goals, assistance and precautions at the next scheduled visit. Agree any changes with the patient and treating team before publishing a revised programme.', created_at: '2026-11-18T10:00:00Z', snapshot: {
      patient_name: patient.name, condition: patient.condition, author: 'NeuroFicio care team', period_start: '2026-10-28', period_end: '2026-11-18', plan: data.plans.find(p => p.patient_id === patient.id) ?? null,
      observations: data.observations.filter(o => o.patient_id === patient.id), checkins: data.checkins.filter(c => c.patient_id === patient.id), notes: data.notes.filter(n => n.patient_id === patient.id && n.published),
    } });
  }
  // Keep this synthetic timeline relative to the review day rather than going stale.
  const offset = Date.parse(new Date().toISOString().slice(0, 10)) - Date.parse('2026-11-18');
  return JSON.parse(JSON.stringify(data), (_key, value) => {
    if (typeof value !== 'string' || !/^2026-\d{2}-\d{2}(?:T|$)/.test(value)) return value;
    const shifted = new Date(Date.parse(value) + offset).toISOString();
    return value.length === 10 ? shifted.slice(0, 10) : shifted;
  }) as PortalData;
}
