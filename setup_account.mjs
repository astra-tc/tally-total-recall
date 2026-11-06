import { createAccount, addDelegateKey, generateDelegateKey } from '@mysten-incubation/memwal/account';
import fs from 'fs';
const net=process.argv[2]||process.env.MEMWAL_NET;
if(!net){console.error('usage: node setup_account.mjs testnet|mainnet (or MEMWAL_NET via ./run.sh)');process.exit(1);}
const IDS={testnet:['0x0a625e2db2af6f591a4c80a3d8551ddf11656089cc3a20c5e9e7f8fb75b9265c','0x736aef9906798fca4460490ccdf8e8502ef170122dc26ecae32111b78c6b42dd'],
 mainnet:['0xe7c16fbea0560e7057e2bf7422feaa4fb313749fc69c9e9092fac7a33b81d7f5','0x8bf82c9e09e36b8d1c38298f68b7cb68e7b8762887e7592add9986d5e9cf199f']}[net];
const sk=fs.readFileSync('/workspace/secure/sui_total_recall_key.txt','utf8').trim();
const out=`/workspace/secure/memwal_${net}.json`;
let s=fs.existsSync(out)?JSON.parse(fs.readFileSync(out)):{};
if(!s.accountId){const a=await createAccount({packageId:IDS[0],registryId:IDS[1],suiPrivateKey:sk,suiNetwork:net});s.accountId=a.accountId;s.createDigest=a.digest;fs.writeFileSync(out,JSON.stringify(s),{mode:0o600});}
if(!s.delegateKey){const d=await generateDelegateKey();const r=await addDelegateKey({packageId:IDS[0],registryId:IDS[1],accountId:s.accountId,publicKey:d.publicKey,label:'tally-app',suiPrivateKey:sk,suiNetwork:net});
 s.delegateKey=d.privateKey;s.delegatePub=r.publicKey;s.agentId=r.suiAddress;s.addDigest=r.digest;fs.writeFileSync(out,JSON.stringify(s),{mode:0o600});}
console.log(JSON.stringify({accountId:s.accountId,agentId:s.agentId,createDigest:s.createDigest,addDigest:s.addDigest}));
