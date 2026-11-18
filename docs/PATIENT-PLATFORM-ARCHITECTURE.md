# NeuroFicio patient care platform: initial architecture

Date: 18 November 2026
Status: proposed implementation blueprint; no authentication or clinical storage implemented.

## Product scope

Extend the existing Next.js website with a secure portal for home rehabilitation. Patients see their care plan, shared clinical instructions, appointments and progress. Clinicians manage their caseload, assessments, notes, home programmes and review reports. A designated clinical lead can oversee all patients within the clinic.

The existing site describes Hyderabad home care and international enquiries. Plan an India-first pilot, but confirm actual patient locations, provider locations, hosting region and applicable obligations before collecting real health data. International enquiries do not establish permission to deliver clinical care internationally.

## Roles and access

| Role | Scope | Main actions |
| --- | --- | --- |
| Patient | Own patient record | Read published care information; submit check-ins; see appointments and reports |
| Caregiver | Explicitly authorised patient and permissions | Support check-ins and read approved information using a separate account |
| Treating clinician | Assigned patients within clinic | Assess, document visits, manage appropriate care plans and publish permitted updates |
| Clinical lead | All patients within clinic | Clinic-wide clinical oversight, assignment, review and reporting |
| Operations administrator | Scheduling and administrative fields | Invitations, appointments and operations; no clinical access by default |

Clinical permissions must also reflect professional scope. Recording an existing prescription and issuing a prescription are different actions. Medication prescribing requires an appropriately authorised professional and a separate validated workflow.

Server-controlled memberships determine roles; users cannot promote themselves. Email proves account access, not clinical identity or permission to view a patient. Never expose a patient record solely because an email address matches a submitted value. Invitations bind a verified account to a specific patient record. A patient can exist before an account is linked.

The clinical lead role addresses the request for doctor access to all pages and patient records. Additional clinicians receive assignments rather than unrestricted access by default. All clinical access stays within the relevant clinic.

## User journeys

### Patient

1. Staff create a patient record, verify the intended recipient and send an invitation.
2. Patient verifies email through a one-time code or secure link, accepts the invitation and reviews privacy and care information.
3. Dashboard explains today's activities, next appointment, latest doctor update and next review date.
4. Patient opens the current clinician-approved programme: instructions, frequency, assistance required, precautions and review date.
5. Patient records completion, symptoms and difficulty. Skipped activities have a reason; missed data is not treated as zero symptoms or completed care.
6. Patient sees progress against personal goals, with dated measurements, units and who recorded them.
7. Patient reads published notes, views approved documents and downloads a dated progress report.
8. At review or discharge, patient sees the revised plan or agreed discharge information and access arrangements.

### Doctor or therapist

1. An authorised clinic administrator provisions the clinician; clinician signs in and completes MFA.
2. Worklist shows assigned patients, upcoming reviews, unreviewed check-ins and tasks requiring attention. Clinical lead can view the clinic-wide list.
3. Clinician opens a patient summary covering relevant history, precautions, consent, care team and previous reviews.
4. Baseline assessment defines appropriate measures, patient goals, review interval and care plan.
5. Clinician publishes home-care instructions and a patient-friendly summary. Working drafts remain distinct from published information.
6. After a visit, clinician documents findings, records measurements and updates the plan where appropriate.
7. Clinician reviews submitted data in a staffed work queue. Every follow-up item has an owner, status and due time.
8. Clinician reviews and publishes the periodic progress report; patient receives a neutral notification to sign in.
9. Clinician reassesses, transfers or discharges the patient with an audit trail.

### Caregiver and administration

Caregivers use named accounts, scoped consent and revocable access. Submissions identify whether they were entered by the patient, caregiver or clinician. Where a patient cannot provide consent, the clinic verifies the representative's authority through an agreed process.

Operations staff invite users, schedule appointments and assign administrative tasks. Reassignment of clinical responsibility and changes to privileged clinical roles require authorised staff. Disabling an account revokes access without deleting the clinical record.

## Portal structure

Patient navigation: Overview, My care plan, Daily check-in, My progress, Doctor updates, Appointments, Documents, Account and access.

Clinician navigation: Overview, Patients, Reviews and tasks, Appointments, Reports. Patient workspace: Summary, Assessments, Goals, Care plan, Check-ins, Notes, Documents, Reports, Care team.

Suggested route groups:

- `/portal/login`, `/portal/accept-invite`
- `/portal/patient`, `/portal/patient/plan`, `/portal/patient/check-in`, `/portal/patient/progress`
- `/portal/patient/updates`, `/portal/patient/appointments`, `/portal/patient/documents`
- `/portal/clinician`, `/portal/clinician/patients`, `/portal/clinician/patients/[patientId]`
- `/portal/clinician/reviews`, `/portal/clinician/reports`
- `/portal/admin` for appropriately scoped operational administration

Routes are navigation boundaries, not security boundaries. Every server action, query, file download and export must independently authorise the current user.

## Technical architecture

Keep the current Next.js and TypeScript application. Use one modular application for the initial release, with explicit modules for identity, patient records, care plans, observations, clinical documentation, appointments, reports and audit.

```text
Existing public website + patient/clinician portal
                      |
           Verified session and MFA
                      |
       Next.js server application layer
        Authorisation / input validation
          |              |              |
     PostgreSQL     Private files    Transactional outbox
     + row access   + scoped links   -> background worker
     policies                        -> email / reminders
          |
     Audit events, operational monitoring and backups
```

Recommended initial provider candidate: Supabase for managed PostgreSQL, Auth and private Storage, subject to procurement, region and health-data requirements. Supabase is a service candidate, not a compliance guarantee. Keep business rules in application modules and schema migrations so the provider can be changed.

Use the existing deployment provider if it supports the chosen server runtime and data requirements. Select an email delivery provider after verifying region, contracts and deliverability. Start with email notifications containing no diagnosis, notes or measurements. Store notification events transactionally, retry failed deliveries and prevent duplicates.

Apply patient and clinic scoping in the server and database policies. Private files require equivalent access checks; signed download URLs should expire quickly. Service credentials stay on the server and are not the default mechanism for user-scoped reads. Keep clinical pages out of public caches, analytics, search indexing and session recordings. Exclude health data from application logs and error reports.

Use separate development, staging and production environments. Development and staging use synthetic data. Maintain encryption, secrets management, migration history, monitoring, database backups and private-file recovery. Test restoration of both database and files before a live pilot.

## Core records

| Area | Records |
| --- | --- |
| Identity | Clinics, accounts, clinic memberships, invitations |
| Relationships | Patients, patient-account links, care-team assignments, caregiver grants |
| Care | Assessments, goals, versioned care plans, prescribed activities |
| Progress | Check-ins, activity logs, measure definitions, observations |
| Clinical documentation | Notes, note versions, shared updates, clinical sign-off |
| Operations | Appointments, review tasks, notification outbox |
| Governance | Consent events, private document metadata, reports, audit events |

Patient-scoped records include clinic ID, patient ID, author and timestamps. Enforce relationships so records cannot link a patient in one clinic to data in another. Accounts may have more than one role; permission is evaluated in the current clinic and patient context.

Observations store measure definition, value, unit, observation time, source and recorder. Define whether a higher or lower value represents improvement for each measure. Do not join different scales into one chart or invent an overall recovery percentage.

Care plans follow draft -> published -> superseded or discontinued. Notes follow draft -> signed -> amendment. Signed notes retain their history. Reports follow draft -> clinician reviewed -> published -> superseded. Reports reference the exact measurement period and plan versions used.

Patient-facing summaries and internal working notes are explicitly separated. Visibility labels do not override legal access rights; establish the clinic's record-access process before launch.

## Meaningful progress reporting

Initial report sections:

1. Reporting period, patient identifiers, care team and review date.
2. Baseline and current clinician-selected measurements, with dates, units and source.
3. Goal status and clinician interpretation.
4. Completed prescribed activities divided by scheduled activities, with missing and skipped entries shown separately.
5. Patient-reported symptoms and ability in daily activities.
6. Sessions delivered and relevant care-plan changes.
7. Published clinician summary and next steps.
8. Author, reviewer, publication date and report version.

Attendance and activity completion measure participation; they do not establish health improvement. Clinical interpretation remains with the treating team. Show insufficient data explicitly. Select validated outcome measures with the clinical team, including licensing and suitability checks where necessary.

For the first release, reports can use a secure print view for download as PDF. Stored PDFs, if added, must be private, versioned and access-controlled like the source record.

## Initial release and later phases

### Phase 1: complete pilot workflow

- Invite-only email login; clinician MFA; server and database authorisation.
- Patient registry, clinical assignments and lead-doctor overview.
- Baseline assessment, goals and versioned home-care plan.
- Daily check-in and activity tracking with source attribution.
- Clinical notes with explicit publication of patient-facing updates.
- Progress charts and clinician-reviewed printable reports.
- Basic staff-managed appointments, private documents and review tasks.
- Consent and access records, audit trail, backups and operational monitoring.
- Responsive, accessible interfaces with large targets, plain language and keyboard support.

### Phase 2: care coordination

- Separate caregiver accounts and consent management UI.
- Secure asynchronous messages, response expectations and staffing workflow.
- Appointment requests and reminder preferences.
- Clinician-approved exercise library and reusable plan templates.
- Better care-team handovers, discharge and clinic reporting.
- Additional languages based on the pilot population.

### Phase 3: wider operations

- Billing and payments, video consultations, external integrations and multiple clinics.
- Patient-data exchange standards when an integration requires them.
- Optional clinician-reviewed draft summaries, with explicit approval and traceability.
- Device integrations only after validating measurement quality and operational need.

## Production readiness

Before real patient use, confirm service geography, professional roles, privacy information, consent or other applicable basis, data retention, processor contracts, hosting region, record-access processes and incident handling with qualified local advisers. This blueprint does not assert compliance with any jurisdiction.

Agree clinical ownership, review coverage and escalation handling. A submitted check-in is not a real-time monitored emergency channel. Do not add automated clinical thresholds until the clinic has approved the rules and staffed the response process.

Minimum acceptance checks:

- Patient A cannot read or change Patient B's records through UI, direct requests, IDs, exports or file links.
- Unassigned clinicians cannot access a patient; the clinic lead can access all patients within the clinic, never another clinic's data.
- Users cannot self-assign roles; invitation acceptance requires the intended verified account.
- Revoked assignments, caregiver grants and disabled accounts lose access within a defined, tested interval.
- Drafts and internal working notes do not appear in patient views or exports.
- Signed records retain amendment history; submitted check-ins do not overwrite clinical observations.
- Staff MFA is enforced on protected operations, not just during a login screen.
- Reminder failures are visible and recoverable; missed data is shown accurately.
- Audit records capture material access and changes without copying health data into operational logs.
- Backup restoration recovers database relationships and private documents.
- Mobile, keyboard, session expiry and account recovery journeys work.

## Implementation order

1. Validate this workflow and build both dashboards with synthetic data.
2. Provision the approved backend, database migrations, identity and access policies.
3. Connect one vertical workflow: invite patient -> baseline -> publish care plan -> submit check-in -> clinician review -> publish report.
4. Add documents, appointments and operational controls; verify access isolation and recovery.
5. Run a limited staffed pilot, collect feedback and then expand.

A visual prototype must be clearly marked as a demo and must not accept real patient information before the secure backend is connected and verified.

## Technical references

- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase row-level security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase MFA: https://supabase.com/docs/guides/auth/auth-mfa
- Supabase private storage access: https://supabase.com/docs/guides/storage/security/access-control
- OWASP authorisation: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
