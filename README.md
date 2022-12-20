# deploying smart contracts

## Typesoftransactions

+ Cryptocurrency transaction (EOA -> EOA)
+ Smart contract invocation transaction (EOA -> SC)
+ Deployment transaction (EOA -> "null address" / "0 address")
+ REMASC transaction (specific for RSK - autoexecuted on each block)

#### REMASC

Reward Manager Smart Contract (REMASC)is a pre-compiled smart-contract that is executed on every block and has the responsibility to fairly distribute rewards collected from transaction fees into several participants of the network.

### compiled bytecode vs deployed bytecode

vm executes compiled bytecode -> outputs new bytecode
that new bytecode is stored on blockchain (deployed bytecode)
and that deployed bytecode is executed then.