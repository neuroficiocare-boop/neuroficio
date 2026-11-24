-- Temporarily allow email-verified staff sessions without an authenticator.
-- Re-enable by replacing this function body with select true.
begin;
create or replace function public.care_staff_mfa_required() returns boolean
language sql stable security definer set search_path = '' as $$ select false; $$;
revoke all on function public.care_staff_mfa_required() from public, anon;
grant execute on function public.care_staff_mfa_required() to authenticated;
create or replace function public.care_is_staff(target_patient uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select (not public.care_staff_mfa_required() or coalesce((auth.jwt()->>'aal') = 'aal2', false)) and exists (
    select 1 from public.care_patients p join public.care_memberships m on p.clinic_id = m.clinic_id
    where p.id = target_patient and m.user_id = auth.uid()
    and (m.role = 'lead' or p.clinician_id = auth.uid())
  );
$$;

drop policy patient_create on public.care_patients;
drop policy audit_lead on public.care_audit;
create policy patient_create on public.care_patients for insert to authenticated with check (
  user_id is null and clinician_id = auth.uid() and created_by = auth.uid()
  and (not public.care_staff_mfa_required() or (auth.jwt()->>'aal') = 'aal2')
  and exists (select 1 from public.care_memberships m where m.user_id = auth.uid() and m.clinic_id = care_patients.clinic_id)
);
create policy audit_lead on public.care_audit for select to authenticated using (
  (not public.care_staff_mfa_required() or (auth.jwt()->>'aal') = 'aal2') and exists (
    select 1 from public.care_patients p join public.care_memberships m on m.clinic_id = p.clinic_id
    where p.id = care_audit.patient_id and m.user_id = auth.uid() and m.role = 'lead'
  )
);

commit;
