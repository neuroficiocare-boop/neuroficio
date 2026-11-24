## Password access update ? 24 November 2026

The portal now uses email and password for returning visits. Accounts remain invitation-only; choosing Doctor or Care member does not grant permissions. New invitations ask the recipient to confirm their email and choose a password of 12?128 characters. Existing signed-in users can choose **Set or change password**. Signed-out users choose their login type, then **First visit or forgot your password?** to request a PKCE-protected setup/reset email; open it in the same browser within 15 minutes. Passwords are managed by Supabase Auth and are never stored in application tables or browser storage.

Public example-entry buttons and `?demo=` access were removed. Example fixture definitions remain in source for review/tests, but are no longer imported by the portal. Live records always require a verified account and row-level authorization. Previous demo instructions below are historical.

Validation: `node --test --test-isolation=none scripts/test-care-auth.mjs scripts/test-care-access.mjs scripts/test-care-validation.mjs`. The new auth tests use a mocked provider to exercise session handling, generic errors, password setup, invitation email matching, CSRF and recovery failures. Actual email delivery and entering a chosen password require the owner?s own browser interaction. Supabase?s default email quota and recipient restrictions still apply until custom SMTP is connected.

> Current configuration (24 November 2026): staff authenticator enforcement is temporarily disabled at the owner?s request. Apply `202611240001_staff_email_access.sql` after the initial migration. Email verification, clinic membership, clinician assignment and patient isolation still apply. To restore enforcement, replace `care_staff_mfa_required()` with the same SQL function returning `true`; the application and database both read this setting. Existing enrolled factors are preserved. The MFA instructions below describe that enforced configuration.

# NeuroFicio Care Portal: setup and release notes

## What is implemented

- `/portal`: email-link or email-code sign-in, invitation-link/code acceptance and separate patient/clinical workspaces.
- Patient dashboard, daily check-ins, current and previous care plans, clinical measurements, symptom history, published notes, appointments and printable progress reports.
- Clinical patient registry with search, record creation and email invitations; lead-clinician clinic-wide access, assigned-clinician access and staff TOTP MFA enrollment/verification.
- Immutable plan revisions, clinical entries and report snapshots; a narrow check-in review operation.
- Server API with HttpOnly session cookies, verified email identity, same-origin mutation checks, validation and no-store responses.
- PostgreSQL migration with row-level access policies, audit events, staff MFA requirements and no anonymous access.
- A clearly labelled fictional demo. Changes are stored in sessionStorage for that browser tab; the demo never calls the clinical-data API.
- Portal exclusion from search indexing and optional analytics. Public-to-portal navigation uses a full document load so public analytics scripts are not carried into the portal.

## Local preview

Run `npm run dev -- --port 3100`, then visit:

- http://localhost:3100/portal
- http://localhost:3100/portal?demo=patient
- http://localhost:3100/portal?demo=clinician

Demo workflow: submit a check-in as Asha, switch to doctor view, acknowledge it, record a measurement, publish a report, then switch back to patient view. Use Reset demo to discard the fictional session. Do not enter real identifying or medical details into the demo.

## Connect the secure backend

1. Select a Supabase project and region approved for the clinic's intended health-data use. This code has not provisioned or altered a hosted project.
2. Apply `supabase/migrations/202611180001_care_portal.sql` using the SQL editor or migration CLI. Review against any existing database objects first. The migration is intended for a fresh portal schema and runs in a transaction.
3. Set these **server environment variables** in `.env.local` and the deployment provider's secret settings:

   ```text
   SUPABASE_URL=<project URL>
   SUPABASE_ANON_KEY=<project publishable or legacy anon key>
   SUPABASE_SERVICE_ROLE_KEY=<server-only service role key; required to send invitations>
   CARE_PORTAL_ENABLED=true
   ```

   Never expose the service key through a `NEXT_PUBLIC_` variable or commit it. Regular clinical queries use the current user's JWT and RLS. The service key is used only for a patient invitation after staff authorisation succeeds.

   Keep `CARE_PORTAL_ENABLED=false` while the connection is being prepared. Set it to `true` only after the Production credential and invitation configuration have been checked, then redeploy. The example patient views remain available while email access is disabled.

4. Set Auth's Site URL to `https://www.neuroficio.com/portal` and restrict any additional redirect destinations to approved portal origins. Keep invitation-only enrollment; the application uses `shouldCreateUser: false` for sign-in.
5. The default `SUPABASE_EMAIL_MODE=link` works with Supabase's standard Magic Link email. The portal stores a short-lived PKCE verifier in an HttpOnly cookie, exchanges the callback code on the server and keeps session tokens out of browser storage. Links must be opened in the browser that requested them within 15 minutes. The default review email service may deliver only to project-team addresses and has restrictive quotas; configure custom SMTP before onboarding other patients.
6. The standard **Invite User** link returns to the portal, which removes the token fragment immediately and asks the recipient to confirm the invited email before creating a server session. With custom SMTP, you can instead set `SUPABASE_EMAIL_MODE=code`, show `{{ .Token }}` in the Magic Link template, and show an invitation code with a link to `/portal?invited=1` in the Invite User template. Do not put patient names, diagnoses or notes in these emails. Supabase currently requires custom SMTP or an eligible paid plan to edit templates; neither is purchased automatically.
7. Enable TOTP MFA in Auth. Staff are required to enroll and verify at the portal before clinical data can be loaded. Configure recovery/support procedures for a lost authenticator; the initial UI does not offer factor deletion or recovery overrides.
8. Create the first clinician account through your approved administrative process. After verifying the clinician's identity, provision a clinic membership with SQL as described below. Do not offer public self-selection of clinical roles.
9. Restart the application, sign in as the clinician, finish MFA setup, create a fictional pilot patient and test the entire invitation and report workflow with controlled test accounts before using real records.

## First clinic and lead clinician

Run from a trusted database administration context, replacing the placeholders with the actual verified Auth user ID and generated clinic ID:

```sql
insert into public.care_clinics(name)
values ('NeuroFicio') returning id;

insert into public.care_memberships(user_id, clinic_id, role)
values ('<verified-auth-user-uuid>', '<returned-clinic-uuid>', 'lead');
```

Additional clinicians use role `clinician`. The initial version supports one clinic membership per clinician. New patients are assigned to the creating clinician; a lead can see every patient in that clinic. Reassignment is currently an administrative SQL operation. Verify that the target clinician belongs to the same clinic before changing `care_patients.clinician_id`.

Invitations are a separate explicit action after record creation. If the invited email already has an Auth account, ask the patient to request a sign-in code. Verified patient accounts claim only the matching staff-created email record. Staff must verify the email and intended patient before invitation; a shared family email is not suitable for independent patient identities in this initial release.

## Verification

Run:

```text
npx tsc --noEmit
node --test --test-isolation=none scripts/test-care-access.mjs scripts/test-care-validation.mjs
npm run build
```

The SQL tests run the actual migration in an isolated embedded PostgreSQL engine with fixture Auth identities. They check patient isolation, draft-note visibility, role escalation, check-in ownership, prescribed activity validation, staff MFA, clinician assignment, cross-clinic isolation, revocation, verified-email linking and immutable audit records. They do not test the hosted Supabase Auth service, SMTP delivery or a real deployment's cookie/TLS configuration; test those separately with controlled accounts.

## Scope still required before a real-patient launch

This is an initial implementation, not a completed production clinical service. Email delivery, hosted Auth, backend provisioning and deployment have not been verified unless separately recorded in the handover. Complete the clinic's governance review and a staffed pilot before real use.

- Confirm privacy information, consent/representative authority, retention, data access/correction procedures, clinical ownership and incident handling for the actual service locations.
- Establish and test database and private-file backups, restore procedures and operational monitoring. The current application stores no uploaded clinical documents.
- Add explicit care consent capture and versioned privacy acknowledgement before real-patient onboarding.
- Add durable record-read auditing if required by the clinic. The initial audit table records writes, reviews, account linking and invitations; it does not represent a complete read-access audit.
- Add document uploads/private download authorisation, caregiver accounts, secure messages, reminder queues and staffing/escalation rules in a subsequent release. None is simulated as a working live service here.
- Reports record measurements, check-in counts, shared notes, plan snapshot and clinician interpretation. They do not calculate a clinical recovery percentage or claim daily adherence for dates with no response.
- A report's clinical review is the clinician's explicit publish action; this is not a regulated electronic-signature or medication-prescribing system.
- Saved internal drafts cannot be edited/published in place in this initial release. Create a new shared note to publish patient-facing advice; use a new clearly identified amendment to correct an existing entry.
- Appointments can be scheduled and viewed. Rescheduling/cancellation, user profile changes, deletion and exports beyond the report print view need additional workflows.
- Check-ins are one per patient per day and may cover today or the previous seven days. A patient should contact the team to correct an existing check-in.
- Clinical records are loaded into the current authenticated browser view. Signing out clears application state; avoid shared computers and browser printing for confidential records without the clinic's procedures.

## Deployment

Deploy this existing Next.js project through its established hosting provider. No new Sites project, domain change or alternative public copy is needed. Configure production secrets there, apply the database migration first and verify portal response headers, HTTPS cookies, SMTP, staff MFA and patient isolation in the deployed environment. The existing public website continues to use its established routes and content.
