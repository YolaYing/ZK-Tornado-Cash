//@ts-ignore
import { Address, require } from "@hyperoracle/zkgraph-lib";
import { Bytes, Block, Event } from "@hyperoracle/zkgraph-lib";

var addr_blacklist = Bytes.fromHexString("0x7169D38820dfd117C3FA1f22a697dBA58d90BA06");
var esig_blacklist = Bytes.fromHexString("0x42e160154868087d6bfdc0ca23d96a1c1cfa32f1b72ba9ba27b69b98a0d819dc");
var addr_mixer =  Bytes.fromHexString("0xd92992b49c39c917b6cc587c22e51f720c4b7062");
var esig_mixer =  Bytes.fromHexString("0xb81e312ef0fd2fe7d15a46587c6f1254fb26f651c4fa8bba52a3817718902885");

// (dummy) mixer contract that I wrote for this specific project 0xd92992b49c39c917b6cc587c22e51f720c4b7062
// USDT contract 0x7169D38820dfd117C3FA1f22a697dBA58d90BA06

export function handleBlocks(blocks: Block[]): Bytes {

 
  let eventsByAcctEsig_mixer: Event[] = blocks[0]
    .account(addr_mixer)
    .eventsByEsig(esig_mixer);

    console.log("debug");

  // create a blacklist for a list of chain of blocks
  // Talked with super helpful HO developer Lightman and Suning, and learned that currently zkgraph only support one block query per execution,
  // but planed to add the feature to query a chain of block in the future.
  // The code logic will compile and work fine here but won't make too many real world sense in the current stage.
  // It will make more sense once the feature is added, and no code change is required to make it work then.
  // It is fun to write code for the future feature lol 
  require(eventsByAcctEsig_mixer.length > 0);

  let blacklist = new Set<Address>();
  for(let i = 0; i < blocks.length; i++){

      let eventsByAcctEsig_blacklist: Event[] = blocks[i]
 
    .account(addr_blacklist)
    .eventsByEsig(esig_blacklist);
    for(let j = 0; j < eventsByAcctEsig_blacklist.length; j++){
      let bytes_blacklisted_address: Bytes = eventsByAcctEsig_blacklist[j].data;
      let blacklisted_address: Address = Address.fromBytes(
        bytes_blacklisted_address
      );
      blacklist.add(blacklisted_address);
    }
  }
  
  // check if anyone in the mixer pool is also in the blacklist, if so, return 1 to show a WARNING and maybe inform the downstream smartcontract not to continue (To be added)
  // Else, return 1, and both users can use the mixer safely.
  // can be easily extended to more users version
  let mixerEvent = eventsByAcctEsig_mixer[0];
  let addr1: Address = Address.fromBytes(mixerEvent.data.slice(0,32));
  let addr2: Address = Address.fromBytes(mixerEvent.data.slice(32,64));

  if(blacklist.has(addr1) || blacklist.has(addr2) ){
    return Bytes.fromI32(1);
  }
  else{
    return Bytes.fromI32(0);
  }

  

}
