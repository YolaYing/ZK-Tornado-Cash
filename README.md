# zkGraph zkSafeMixer

#### This graph listen to the both USDT contract and the dummy mixer contract that I wrote for this project

This zkgraph was lightly inspired by [proof of Blacklist](https://github.com/varun-doshi/Proof-of-Blacklist-zkGraph) and also [Vitalik's proof of innocence](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4563364). 

Crypto Mixer is used for privacy, like tornado cash. But sometimes, it mix your innoncent money with other bad guys' money. It is important to guard against malicious users from using it. 

The idea of zkSafeMixer is to query a blacklist of some tokens (here we used USDT for example, and can easily extended to other tokens and even mutiple tokens), and when a user trying to deposit money to a crypto mixer smart contract (here I used a dummy contract I wrote for this project), it checked weather or not any of the users are in the blacklist. If so, it will return a warning signal (1) and potentially prevent the downstream contracts from taking the money.

This was done by listen to mutiple contracts (token contracts and mixer contracts) together in a zkgraph.

We Talked with super helpful HO developer Lightman and Suning, and learned that currently zkgraph only support one block query per execution, but planed to add the feature to query mutiple blocks together in the future.

The current code logic will compile and work fine but right now it won't make too many real world sense because current zkGraph only allow to query one block at a time.

It will make more sense once the feature is added, and no code change is required to make it work then.

It is fun to write an application code for the future feature though 

 

####  

## Test Contract and Block id
when debugging execution and proof generation, you may use:
- block id: 5111991
- contract address: ef980824454e458a1ad4ec2510e485cce3ead0faac0

or you can just use 'script.sh' to test the whole workflow(remember to fill in the zkgraph.config.ts)


## Usage CLI

> Note: Only `full` image will be processed by zkOracle node. `local` (generated by commands ending with `--local` option) means the zkGraph is compiled locally and only contains partial computation (so that proving and executing will be faster).

The workflow of local zkGraph development must follow: `Develop` (code in /src) -> `Compile` (get compiled wasm image) -> `Execute` (get expected output) -> `Prove` (generate input and pre-test for actual proving in zkOracle) -> `Verify` (verify proof on-chain).

To upload and publish your zkGraph, you should `Upload` (upload code to IPFS), and then `Publish` (register zkGraph on onchain zkGraph Registry).

## Commonly used commands

- **compile**: `npx zkgraph compile`
- **exec**: `npx zkgraph exec <block id>`
- **prove**: ` npx zkgraph prove <block id> <expected state> -i|-t|-p`
- ……

Read more: https://github.com/hyperoracle/zkgraph-cli#cli
