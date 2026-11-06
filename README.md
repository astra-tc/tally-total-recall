# Tally — a shared budget that remembers
Walrus x Tatum "Total Recall" entry by Astra Trading Company (Consumer Finance track).
Group expenses, who-owes-what, and learned spending limits/habits persisted in **Walrus Memory** (MemWal), so the app picks up where the group left off across sessions. Tatum Sui RPC for on-chain settlement reads.

## Mainnet status (6 Nov 2026)
- MemWal Account ID: `0xabde14269e71abb7073330f4b8b1e0a7f28dca98ce0310b1a525e270c59a81fd`
- MEMWAL_AGENT_ID (delegate): `0x1a547a6efc30be59b42ae33d47033a352cb92eae38924865c926f3e84e547464`
- Relayer: `https://relayer.memory.walrus.xyz`
- ≥14 realistic group-budget memories stored on mainnet (expenses, category limits, habits); semantic recall verified (grocery limit, utilities payer, settlement habit).
- Staging/testnet relayer still has a TLS cert mismatch (`relayer-staging.memory.walrus.xyz` serves `*.up.railway.app`); mainnet path is the working demo.

## Layout
- `tally.mjs` core (falls back to the offline `MemWalMock` without credentials)
- `setup_account.mjs` creates a MemWalAccount + delegate key server-side (keys stay in a local secure dir, never committed)
- `seed_memories.mjs` writes demo expenses/limits/habits via the relayer
- `tatum.mjs` Tatum Sui mainnet gateway (GraphQL): balances + incoming USDC settlements; `Tally.reconcile()` auto-closes debts
- `./run.sh mainnet|testnet <script.mjs>` loads secrets from `/workspace/secure` and sets the relayer URL
- `node test.mjs`, `node test_tatum.mjs` (TATUM_LIVE=1 for a live gateway check via `./run.sh`)

Working GitHub mirror (pushable): https://github.com/astra-tc/tally-total-recall (fork of astratc/tally-total-recall; parent push blocked by unverified email).

Contact: carl.astratc@proton.me
