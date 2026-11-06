import { Tally, makeMemory } from './tally.mjs';
const mem = makeMemory();
const t = new Tally(mem);
const members = ['Alex','Blake','Casey','Drew'];
const expenses = [
  {payer:'Alex', amount:48.5, split:members, category:'groceries', note:'weekly Trader Joe run'},
  {payer:'Blake', amount:32.0, split:['Alex','Blake','Casey'], category:'dining', note:'Thursday ramen'},
  {payer:'Casey', amount:120.0, split:members, category:'utilities', note:'October electric bill'},
  {payer:'Drew', amount:18.75, split:['Drew','Alex'], category:'transport', note:'Uber to airport'},
  {payer:'Alex', amount:65.0, split:members, category:'household', note:'cleaning supplies + paper goods'},
  {payer:'Blake', amount:90.0, split:['Blake','Casey','Drew'], category:'entertainment', note:'concert tickets share'},
  {payer:'Casey', amount:27.4, split:members, category:'groceries', note:'weekend farmer market'},
];
const limits = [
  ['groceries', 250],
  ['dining', 150],
  ['utilities', 200],
  ['entertainment', 100],
];
const habits = [
  'Habit: Alex usually pays groceries on Sundays and prefers Trader Joe over Whole Foods.',
  'Habit: Group settles debts every first Monday via USDC on Sui.',
  'Habit: Casey handles utilities and posts the bill PDF in the chat.',
];
let n=0;
for (const e of expenses) {
  await t.addExpense(e);
  n++;
  console.log('expense', n, e.category, e.amount);
}
for (const [cat, lim] of limits) {
  await t.learnLimit(cat, lim);
  n++;
  console.log('limit', cat, lim);
}
for (const h of habits) {
  await mem.rememberAndWait(h, undefined, {timeoutMs:60000});
  n++;
  console.log('habit', n);
}
console.log('stored', n);
const recall1 = await t.ask('What is the grocery monthly limit?');
const recall2 = await t.ask('Who paid for utilities in October?');
const recall3 = await t.ask('How does the group settle debts?');
console.log(JSON.stringify({
  stored: n,
  balances: t.balances(),
  recallGrocery: recall1,
  recallUtilities: recall2,
  recallSettle: recall3,
}, null, 2));
