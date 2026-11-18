-- Apply to a new Supabase project. No patient data is seeded by this migration.
begin;

create table public.care_clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 150)
);
create table public.care_memberships (
  user_id uuid primary key references auth.users(id),
  clinic_id uuid not null references public.care_clinics(id),
  role text not null check (role in ('lead', 'clinician'))
);
create table public.care_patients (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.care_clinics(id),
  clinician_id uuid references auth.users(id),
  user_id uuid references auth.users(id),
  name text not null check (length(name) between 1 and 100),
  email text not null check (length(email) between 3 and 254),
  condition text not null check (length(condition) between 1 and 150),
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);
create unique index care_patient_email_clinic on public.care_patients (clinic_id, lower(email));
create index care_patient_user on public.care_patients(user_id);
create index care_patient_clinician on public.care_patients(clinician_id);

create table public.care_plans (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.care_patients(id),
  title text not null check (length(title) between 1 and 150),
  precautions text not null check (length(precautions) between 1 and 2000),
  review_date date not null,
  activities jsonb not null check (jsonb_typeof(activities) = 'array' and jsonb_array_length(activities) between 1 and 12),
  goals jsonb not null check (jsonb_typeof(goals) = 'array' and jsonb_array_length(goals) between 1 and 12),
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  unique(id, patient_id)
);
create table public.care_checkins (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.care_patients(id),
  plan_id uuid not null,
  day date not null,
  completed jsonb not null default '[]' check (jsonb_typeof(completed) = 'array'),
  pain integer not null check (pain between 0 and 10),
  energy integer not null check (energy between 1 and 5),
  comment text not null default '' check (length(comment) <= 2000),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  foreign key (plan_id, patient_id) references public.care_plans(id, patient_id),
  unique (patient_id, day)
);
create table public.care_observations (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.care_patients(id),
  label text not null check (length(label) between 1 and 100),
  value numeric not null check (value >= 0 and value <= 100000),
  unit text not null check (length(unit) between 1 and 30),
  direction text not null check (direction in ('higher', 'lower')),
  measured_on date not null check (measured_on <= current_date),
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);
create table public.care_notes (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.care_patients(id),
  title text not null check (length(title) between 1 and 150),
  body text not null check (length(body) between 1 and 6000),
  published boolean not null default false,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);
create table public.care_appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.care_patients(id),
  title text not null check (length(title) between 1 and 150),
  location text not null check (length(location) between 1 and 200),
  starts_at timestamptz not null,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);
create table public.care_reports (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.care_patients(id),
  title text not null check (length(title) between 1 and 150),
  summary text not null check (length(summary) between 1 and 6000),
  next_steps text not null check (length(next_steps) between 1 and 3000),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);
create table public.care_audit (
  id bigint generated always as identity primary key,
  actor uuid references auth.users(id),
  patient_id uuid references public.care_patients(id),
  record_id uuid,
  event text not null,
  created_at timestamptz not null default now()
);

-- Definer helpers have a fixed search path and use verified server JWT identity.
-- Membership and assignment changes take effect on the next DB request.
create function public.care_is_staff(target_patient uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((auth.jwt()->>'aal') = 'aal2', false) and exists (
    select 1 from public.care_patients p join public.care_memberships m on p.clinic_id = m.clinic_id
    where p.id = target_patient and m.user_id = auth.uid()
    and (m.role = 'lead' or p.clinician_id = auth.uid())
  );
$$;
create function public.care_is_patient(target_patient uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.care_patients where id = target_patient and user_id = auth.uid());
$$;
create function public.care_can_read(target_patient uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.care_is_staff(target_patient) or public.care_is_patient(target_patient);
$$;

create function public.care_claim_patient() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.care_memberships where user_id = auth.uid()) then return; end if;
  -- Account possession is verified by Auth; the matching record was entered by clinical staff.
  update public.care_patients p set user_id = auth.uid()
  from auth.users u where u.id = auth.uid() and u.email_confirmed_at is not null
    and p.user_id is null and lower(p.email) = lower(u.email);
end;
$$;

create function public.care_valid_checkin(target_patient uuid, target_plan uuid, entry_day date, entries jsonb) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.care_is_patient(target_patient)
    and entry_day between current_date - 7 and current_date
    and target_plan = (select id from public.care_plans where patient_id = target_patient order by created_at desc, id desc limit 1)
    and jsonb_typeof(entries) = 'array'
    and jsonb_array_length(entries) = (select count(distinct value) from jsonb_array_elements_text(entries))
    and not exists (
      select 1 from jsonb_array_elements_text(entries) e
      where not exists (select 1 from public.care_plans p, jsonb_array_elements(p.activities) a where p.id = target_plan and a->>'id' = e.value)
    );
$$;

create function public.care_review_checkin(target_checkin uuid, target_patient uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.care_is_staff(target_patient) then raise exception 'Access denied'; end if;
  update public.care_checkins set reviewed_at = now(), reviewed_by = auth.uid()
    where id = target_checkin and patient_id = target_patient and reviewed_at is null;
  if not found then raise exception 'Check-in unavailable or already reviewed'; end if;
end;
$$;
create function public.care_record_invitation(target_patient uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.care_is_staff(target_patient) then raise exception 'Access denied'; end if;
  insert into public.care_audit(actor, patient_id, record_id, event) values (auth.uid(), target_patient, target_patient, 'invitation_sent');
end;
$$;

create function public.care_audit_write() returns trigger
language plpgsql security definer set search_path = '' as $$
declare pid uuid;
begin
  if tg_table_name = 'care_patients' then pid := new.id; else pid := new.patient_id; end if;
  insert into public.care_audit(actor, patient_id, record_id, event) values (auth.uid(), pid, new.id, tg_table_name || ':' || tg_op);
  return new;
end;
$$;
create function public.care_stamp_record() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.created_at := now();
  new.created_by := auth.uid();
  return new;
end;
$$;

alter table public.care_clinics enable row level security;
alter table public.care_memberships enable row level security;
alter table public.care_patients enable row level security;
alter table public.care_audit enable row level security;
-- Keep these explicit as well as in the policy loop for migration-tool inspection.
alter table public.care_plans enable row level security;
alter table public.care_checkins enable row level security;
alter table public.care_observations enable row level security;
alter table public.care_notes enable row level security;
alter table public.care_appointments enable row level security;
alter table public.care_reports enable row level security;
create policy membership_self on public.care_memberships for select to authenticated using (user_id = auth.uid());
create policy patient_read on public.care_patients for select to authenticated using (public.care_can_read(id));
create policy patient_create on public.care_patients for insert to authenticated with check (
  user_id is null and clinician_id = auth.uid() and created_by = auth.uid()
  and (auth.jwt()->>'aal') = 'aal2'
  and exists (select 1 from public.care_memberships m where m.user_id = auth.uid() and m.clinic_id = care_patients.clinic_id)
);
create policy audit_lead on public.care_audit for select to authenticated using (
  (auth.jwt()->>'aal') = 'aal2' and exists (
    select 1 from public.care_patients p join public.care_memberships m on m.clinic_id = p.clinic_id
    where p.id = care_audit.patient_id and m.user_id = auth.uid() and m.role = 'lead'
  )
);

do $$
declare tab text;
begin
  foreach tab in array array['care_patients','care_plans','care_checkins','care_observations','care_notes','care_appointments','care_reports'] loop
    execute format('create trigger stamp_before_insert before insert on public.%I for each row execute function public.care_stamp_record()', tab);
    execute format('create trigger audit_after_write after insert or update on public.%I for each row execute function public.care_audit_write()', tab);
  end loop;
  foreach tab in array array['care_plans','care_checkins','care_observations','care_notes','care_appointments','care_reports'] loop
    execute format('alter table public.%I enable row level security', tab);
    if tab = 'care_notes' then
      execute 'create policy record_read on public.care_notes for select to authenticated using (public.care_is_staff(patient_id) or (published and public.care_is_patient(patient_id)))';
    else
      execute format('create policy record_read on public.%I for select to authenticated using (public.care_can_read(patient_id))', tab);
    end if;
    if tab <> 'care_checkins' then
      execute format('create policy staff_create on public.%I for insert to authenticated with check (public.care_is_staff(patient_id) and created_by = auth.uid())', tab);
    end if;
    execute format('create index on public.%I (patient_id)', tab);
  end loop;
end;
$$;
create policy checkin_create on public.care_checkins for insert to authenticated with check (
  created_by = auth.uid() and reviewed_at is null and reviewed_by is null
  and public.care_valid_checkin(patient_id, plan_id, day, completed)
);

-- Immutable clinical entries: amendments are new records, never overwritten history.
-- No authenticated UPDATE/DELETE grants. Review and account linking use narrow RPCs.
revoke all on public.care_clinics, public.care_memberships, public.care_patients, public.care_plans, public.care_checkins, public.care_observations, public.care_notes, public.care_appointments, public.care_reports, public.care_audit from anon, authenticated;
grant select on public.care_memberships, public.care_patients, public.care_plans, public.care_checkins, public.care_observations, public.care_notes, public.care_appointments, public.care_reports, public.care_audit to authenticated;
grant insert on public.care_patients, public.care_plans, public.care_checkins, public.care_observations, public.care_notes, public.care_appointments, public.care_reports to authenticated;

revoke all on function public.care_is_staff(uuid), public.care_is_patient(uuid), public.care_can_read(uuid), public.care_claim_patient(), public.care_valid_checkin(uuid,uuid,date,jsonb), public.care_review_checkin(uuid,uuid), public.care_record_invitation(uuid), public.care_audit_write(), public.care_stamp_record() from public, anon;
grant execute on function public.care_is_staff(uuid), public.care_is_patient(uuid), public.care_can_read(uuid), public.care_claim_patient(), public.care_valid_checkin(uuid,uuid,date,jsonb), public.care_review_checkin(uuid,uuid), public.care_record_invitation(uuid) to authenticated;

commit;
