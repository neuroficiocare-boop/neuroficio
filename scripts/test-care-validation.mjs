import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/portal/validation.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
const v = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('Reject malformed dates and preserve leap-year dates', () => {
  assert.equal(v.day('2028-02-29'), '2028-02-29');
  for (const value of ['2026-02-29', '2026-02-30', '2026-13-01', '', null]) assert.throws(() => v.day(value));
});
test('Do not coerce absent or non-finite clinical measurements', () => {
  for (const value of [NaN, Infinity, '4', null, -1, 11]) assert.throws(() => v.number(value, 'Pain', 0, 10));
  assert.equal(v.number(0, 'Pain', 0, 10), 0);
});
test('Completion accepts only unique activities prescribed in the current plan', () => {
  assert.deepEqual(v.completed([], ['a']), []);
  assert.deepEqual(v.completed(['a'], ['a']), ['a']);
  for (const value of [['a', 'a'], ['b'], [null], {}, null]) assert.throws(() => v.completed(value, ['a']));
});
test('Mutations require a matching Origin, including scheme and port', () => {
  const request = origin => new Request('https://neuroficio.test/api/portal/data', { headers: origin ? { Origin: origin } : {} });
  v.sameOrigin(request('https://neuroficio.test'));
  for (const origin of ['https://attacker.test', 'http://neuroficio.test', 'https://neuroficio.test:444', null]) assert.throws(() => v.sameOrigin(request(origin)));
});
