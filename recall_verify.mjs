// Read-only mainnet recall verification — no remember/write.
import { makeMemory, Tally } from './tally.mjs';
const mem = makeMemory();
const t = new Tally(mem);
const queries = [
  'What is the grocery monthly limit?',
  'Who paid for utilities in October?',
  'How does the group settle debts?',
  'Are we over on dining?',
  'entertainment limit',
];
const out = { accountId: process.env.MEMWAL_ACCOUNT_ID, server: process.env.MEMWAL_SERVER_URL, recalls: {} };
let totalHits = 0;
for (const q of queries) {
  const r = await t.ask(q);
  const results = Array.isArray(r) ? r : (r?.results ?? r ?? []);
  const texts = (Array.isArray(results) ? results : []).map(x => {
    if (typeof x === 'string') return x;
    return x?.content ?? x?.text ?? x?.memory ?? JSON.stringify(x).slice(0, 240);
  });
  out.recalls[q] = { count: texts.length, samples: texts.slice(0, 5) };
  totalHits += texts.length;
}
out.totalHits = totalHits;
console.log(JSON.stringify(out, null, 2));
