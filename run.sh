#!/bin/sh
# usage: ./run.sh testnet|mainnet script.mjs   (secrets read from /workspace/secure, never committed)
# Exports MEMWAL_NET so scripts like setup_account.mjs know the network even though
# run.sh does not forward argv (keeps node $2 compatible with older scripts).
F=/workspace/secure/memwal_$1.json
export MEMWAL_NET=$1
[ -f "$F" ] && export MEMWAL_KEY=$(node -e "console.log(require('$F').delegateKey)") MEMWAL_ACCOUNT_ID=$(node -e "console.log(require('$F').accountId)")
[ -f /workspace/secure/tatum_api_key.txt ] && export TATUM_API_KEY=$(tr -d ' \n\r' </workspace/secure/tatum_api_key.txt)
[ "$1" = mainnet ] && export MEMWAL_SERVER_URL=https://relayer.memory.walrus.xyz
node $2
