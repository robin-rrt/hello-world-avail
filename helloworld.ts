import { initialize, getKeyringFromSeed } from "avail-js-sdk"
import { ISubmittableResult } from "@polkadot/types/types/extrinsic"
import { H256 } from "@polkadot/types/interfaces/runtime"

const main = async () => {
  try {
    //initialize sdk
    const api = await initialize("wss://turing-rpc.avail.so/ws")

    // get your Avail account
    const account = getKeyringFromSeed("enter your avail seed")
    console.log(account.address)

    const data = "Hello World"

    // submit the data using dataAvailability.submitData extrinsic
    const txResult = await new Promise<ISubmittableResult>((res) => {
      api.tx.dataAvailability.submitData(data).signAndSend(account, (result: ISubmittableResult) => {
        console.log(`Tx status: ${result.status}`)
        if (result.isFinalized || result.isError) {
          res(result)
        }
      })
    })

    // Rejected Transaction handling
    if (txResult.isError) {
      console.log(`Transaction was not executed`)
      process.exit(1)
    }
    const [txHash, blockHash] = [txResult.txHash as H256, txResult.status.asFinalized as H256]
    console.log(`Tx Hash: ${txHash}, Block Hash: ${blockHash}`)

    // Extracting data
    const block = await api.rpc.chain.getBlock(blockHash)
    const tx = block.block.extrinsics.find((tx) => tx.hash.toHex() == txHash.toHex())
    if (tx == undefined) {
      console.log("Failed to find the Submit Data transaction")
      process.exit(1)
    }

    console.log(JSON.stringify(tx))
    const dataHex = tx.method.args.map((a) => a.toString()).join(", ")
    // Data retrieved from the extrinsic data
    let str = ""
    for (let n = 0; n < dataHex.length; n += 2) {
      str += String.fromCharCode(parseInt(dataHex.substring(n, n + 2), 16))
    }
    console.log(`submitted data: ${str}`)

  process.exit()
} catch (err) {
    console.error(err)
    process.exit(1)
  }}
main()