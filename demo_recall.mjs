// Silent demo: read-only mainnet recall + local ledger "before/after warning" illustration.
// Does NOT write memories or sign transactions.
import { makeMemory, Tally } from './tally.mjs';

const members = ['Alex','Blake','Casey','Drew'];
const mem = makeMemory();
const t = new Tally(mem);

// Local ledger mirror of the seeded expenses (for warning math only; no writes).
const expenses = [
  {payer:'Alex', amount:48.5, split:members, category:'groceries', note:'weekly Trader Joe run'},
  {payer:'Blake', amount:32.0, split:['Alex','Blake','Casey'], category:'dining', note:'Thursday ramen'},
  {payer:'Casey', amount:120.0, split:members, category:'utilities', note:'October electric bill'},
  {payer:'Drew', amount:18.75, split:['Drew','Alex'], category:'transport', note:'Uber to airport'},
  {payer:'Alex', amount:65.0, split:members, category:'household', note:'cleaning supplies + paper goods'},
  {payer:'Blake', amount:90.0, split:['Blake','Casey','Drew'], category:'entertainment', note:'concert tickets share'},
  {payer:'Casey', amount:27.4, split:members, category:'groceries', note:'weekend farmer market'},
];
for (const e of expenses) t.ledger.push({...e, ts:Date.now()});

function spent(cat){
  return t.ledger.filter(e=>e.category===cat).reduce((s,e)=>s+e.amount,0);
}
function warn(cat, limit){
  const s = spent(cat);
  if (limit == null) return `BEFORE learnLimit: ${cat} spend $${s} — no ceiling in memory, no warning.`;
  if (s > limit) return `AFTER learnLimit: WARNING over ${cat} limit — $${s} / $${limit}.`;
  if (s >= limit * 0.8) return `AFTER learnLimit: WARNING approaching ${cat} limit — $${s} / $${limit}.`;
  return `AFTER learnLimit: ${cat} OK — $${s} / $${limit}.`;
}

console.log('=== Tally · Walrus Memory mainnet demo (read-only) ===');
console.log('Account:', process.env.MEMWAL_ACCOUNT_ID);
console.log('Relayer:', process.env.MEMWAL_SERVER_URL);
console.log('');

console.log('--- Local ledger warning illustration (entertainment) ---');
console.log(warn('entertainment', null));
console.log(warn('entertainment', 100));
console.log(warn('dining', 150));
console.log('');

const queries = [
  'What is the grocery monthly limit?',
  'Who paid for utilities in October?',
  'How does the group settle debts?',
  'entertainment limit',
];
for (const q of queries) {
  console.log('Q:', q);
  const r = await t.ask(q);
  const results = Array.isArray(r) ? r : (r?.results ?? []);
  for (const x of results.slice(0, 3)) {
    const text = typeof x === 'string' ? x : (x?.content ?? x?.text ?? x?.memory ?? JSON.stringify(x));
    console.log('  ·', String(text).slice(0, 140));
  }
  console.log('');
}
console.log('Demo complete. No memories written; no transactions signed.');
