import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

const id = n => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;

test('Care portal PostgreSQL access policies', async t => {
  const db = new PGlite();
  try {
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth;
      create table auth.users(id uuid primary key, email text, email_confirmed_at timestamptz);
      create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
      create function auth.uid() returns uuid language sql stable as $$ select (auth.jwt()->>'sub')::uuid $$;
      grant usage on schema auth, public to anon, authenticated;
    `);
    await db.exec(await readFile(new URL('../supabase/migrations/202611180001_care_portal.sql', import.meta.url), 'utf8'));
    await db.exec(await readFile(new URL('../supabase/migrations/202611240001_staff_email_access.sql', import.meta.url), 'utf8'));
    await db.query(`select set_config('request.jwt.claims', $1, false)`, [JSON.stringify({ sub: id(1), aal: 'aal2' })]);
    await db.exec(`
      insert into auth.users values
        ('${id(1)}','lead@example.test',now()), ('${id(2)}','doctor@example.test',now()),
        ('${id(3)}','a@example.test',now()), ('${id(4)}','b@example.test',now()),
        ('${id(5)}','otherlead@example.test',now()), ('${id(6)}','unverified@example.test',null);
      insert into public.care_clinics values ('${id(10)}','Clinic One'), ('${id(11)}','Clinic Two');
      insert into public.care_memberships values ('${id(1)}','${id(10)}','lead'), ('${id(2)}','${id(10)}','clinician'), ('${id(5)}','${id(11)}','lead');
      insert into public.care_patients(id, clinic_id, clinician_id, user_id, name, email, condition) values
        ('${id(20)}','${id(10)}','${id(2)}','${id(3)}','Patient A','a@example.test','Rehabilitation'),
        ('${id(21)}','${id(10)}','${id(1)}','${id(4)}','Patient B','b@example.test','Rehabilitation'),
        ('${id(22)}','${id(11)}','${id(5)}',null,'Patient C','c@example.test','Rehabilitation'),
        ('${id(23)}','${id(10)}','${id(1)}',null,'Unverified','unverified@example.test','Rehabilitation');
      insert into public.care_plans(id, patient_id, title, precautions, review_date, activities, goals) values
        ('${id(30)}','${id(20)}','Plan A','As prescribed',current_date + 7,'[{"id":"activity-a","title":"Activity A","instruction":"As prescribed","frequency":"Daily"}]','[{"title":"Goal","target":"Review"}]'),
        ('${id(31)}','${id(21)}','Plan B','As prescribed',current_date + 7,'[{"id":"activity-b","title":"Activity B","instruction":"As prescribed","frequency":"Daily"}]','[{"title":"Goal","target":"Review"}]');
      insert into public.care_notes(patient_id, title, body, published) values
        ('${id(20)}','Shared','Patient-facing advice',true), ('${id(20)}','Internal','Draft working note',false), ('${id(21)}','Other patient','Private B',true);
    `);
    async function as(user, aal = 'aal1', role = 'authenticated') {
      await db.exec('reset role');
      await db.query(`select set_config('request.jwt.claims', $1, false)`, [JSON.stringify(user ? { sub: id(user), aal } : {})]);
      await db.exec(`set role ${role}`);
    }
    const count = async table => (await db.query(`select count(*)::integer as n from public.${table}`)).rows[0].n;

    await t.test('patients see only their own records and published notes', async () => {
      await as(3);
      assert.equal(await count('care_patients'), 1);
      assert.equal(await count('care_plans'), 1);
      assert.deepEqual((await db.query('select title from care_notes')).rows, [{ title: 'Shared' }]);
      assert.equal((await db.query('select id from care_patients where id=$1', [id(21)])).rows.length, 0);
      assert.equal((await db.query('select id from care_plans where patient_id=$1', [id(21)])).rows.length, 0);
    });
    await t.test('patients cannot self-promote, change clinical records, or forge review state', async () => {
      await as(3);
      await assert.rejects(db.exec(`insert into care_memberships values ('${id(3)}','${id(10)}','lead')`));
      await assert.rejects(db.exec(`update care_patients set user_id='${id(3)}' where id='${id(21)}'`));
      await assert.rejects(db.exec(`insert into care_notes(patient_id,title,body,published) values ('${id(20)}','Forged','Forged',true)`));
      await assert.rejects(db.exec(`insert into care_checkins(patient_id,plan_id,day,pain,energy,reviewed_at) values ('${id(20)}','${id(30)}',current_date,2,3,now())`));
    });
    await t.test('check-ins reject another patient, invalid activities and duplicates', async () => {
      await as(3);
      await assert.rejects(db.exec(`insert into care_checkins(patient_id,plan_id,day,pain,energy) values ('${id(21)}','${id(31)}',current_date,2,3)`));
      await assert.rejects(db.exec(`insert into care_checkins(patient_id,plan_id,day,completed,pain,energy) values ('${id(20)}','${id(30)}',current_date,'["not-prescribed"]',2,3)`));
      await assert.rejects(db.exec(`insert into care_checkins(patient_id,plan_id,day,completed,pain,energy) values ('${id(20)}','${id(30)}',current_date,'["activity-a","activity-a"]',2,3)`));
      await db.exec(`insert into care_checkins(patient_id,plan_id,day,completed,pain,energy) values ('${id(20)}','${id(30)}',current_date,'["activity-a"]',2,3)`);
      await assert.rejects(db.exec(`insert into care_checkins(patient_id,plan_id,day,pain,energy) values ('${id(20)}','${id(30)}',current_date,2,3)`));
      assert.equal(await count('care_checkins'), 1);
    });
    await t.test('email-only staff access remains limited by assignment', async () => {
      await as(2);
      assert.equal(await count('care_memberships'), 1);
      assert.equal(await count('care_patients'), 1);
      assert.equal(await count('care_notes'), 2);
      await as(2);
      assert.equal(await count('care_patients'), 1);
      assert.equal(await count('care_notes'), 2);
      await assert.rejects(db.exec(`insert into care_notes(patient_id,title,body) values ('${id(21)}','Denied','Denied')`));
    });
    await t.test('clinical lead has clinic-wide access but cannot cross clinics', async () => {
      await as(1);
      assert.equal(await count('care_patients'), 3);
      assert.equal((await db.query('select id from care_patients where id=$1', [id(22)])).rows.length, 0);
      await as(5);
      assert.equal(await count('care_patients'), 1);
      assert.equal(await count('care_notes'), 0);
    });
    await t.test('only assigned staff can acknowledge a check-in', async () => {
      await as(3);
      const checkin = (await db.query('select id from care_checkins')).rows[0].id;
      await assert.rejects(db.query('select care_review_checkin($1,$2)', [checkin, id(20)]));
      await as(5);
      await assert.rejects(db.query('select care_review_checkin($1,$2)', [checkin, id(20)]));
      await as(2);
      await db.query('select care_review_checkin($1,$2)', [checkin, id(20)]);
      assert.equal((await db.query('select reviewed_by from care_checkins')).rows[0].reviewed_by, id(2));
    });
    await t.test('unverified accounts cannot claim a matching email record', async () => {
      await as(6);
      await db.exec('select care_claim_patient()');
      assert.equal(await count('care_patients'), 0);
    });
    await t.test('assignment revocation takes effect on the next request', async () => {
      await as(2); assert.equal(await count('care_patients'), 1);
      await db.exec('reset role');
      await db.exec(`update care_patients set clinician_id='${id(1)}' where id='${id(20)}'`);
      await as(2); assert.equal(await count('care_patients'), 0);
    });
    await t.test('anonymous requests cannot read records or invoke privileged functions', async () => {
      await as(null, 'aal1', 'anon');
      await assert.rejects(db.exec('select * from care_patients'));
      await assert.rejects(db.exec('select care_claim_patient()'));
      await assert.rejects(db.exec(`select care_is_staff('${id(20)}')`));
    });
    await t.test('staff can save a new care member and load it in the next request', async () => {
      await as(2);
      await db.query(`insert into care_patients(id,name,email,condition,clinic_id,clinician_id) values ('${id(24)}','New member','newmember@example.test','Home rehabilitation','${id(10)}','${id(2)}')`);
      assert.deepEqual((await db.query('select name from care_patients where id=$1', [id(24)])).rows, [{ name: 'New member' }]);
      await as(3);
      assert.equal((await db.query('select id from care_patients where id=$1', [id(24)])).rows.length, 0);
      await as(5);
      assert.equal((await db.query('select id from care_patients where id=$1', [id(24)])).rows.length, 0);
      await as(2);
      await assert.rejects(db.query(`insert into care_patients(name,email,condition,clinic_id,clinician_id) values ('Duplicate','newmember@example.test','Home rehabilitation','${id(10)}','${id(2)}')`), error => error.code === '23505');
      await assert.rejects(db.query(`insert into care_patients(name,email,condition,clinic_id,clinician_id) values ('Other clinic','other@example.test','Home rehabilitation','${id(11)}','${id(2)}')`));
    });
    await t.test('writes retain an audit trail without copying clinical text', async () => {
      await as(1);
      const audit = (await db.query('select event, actor from care_audit')).rows;
      assert.ok(audit.some(a => a.event === 'care_checkins:INSERT' && a.actor === id(3)));
      assert.ok(audit.some(a => a.event === 'care_checkins:UPDATE' && a.actor === id(2)));
      await assert.rejects(db.exec('delete from care_audit'));
    });
  } finally { await db.close(); }
});
